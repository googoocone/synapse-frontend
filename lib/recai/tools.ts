// /lib/recai/tools.ts

import genAI from "@/lib/gemini/gemini";
import { createClient } from "@/utils/supabase/server";
import { DynamicTool } from "langchain/tools";
import { cookies } from "next/headers";

const KEYWORD_EXTRACTION_PROMPT = `
다음 [사용자 고민]을 보고
{"intent":"한줄 요약","must":["키1","키2","키3"]}
형태의 JSON만 반환해. 다른 말 금지.
[사용자 고민]: {userQueryText}
`;

const ACTION_PLAN_PROMPT = `당신은 사용자의 문제를 해결하기 위해, 주어진 영상 자료를 바탕으로 구체적이고 실천 가능한 액션 플랜을 제안하는 전문 코치입니다. 규칙: 1. 주어진 [사용자 고민]과 [영상 스크립트 내용]을 깊이 있게 분석하세요. 2. 가장 먼저, 어떤 영상을 기반으로 조언하는지 명확하게 언급하며 영상을 추천해주세요. 3. **[매우 중요] 왜 이 영상이 사용자의 고민 해결에 도움이 되는지, 영상의 핵심 원리와 사용자의 상황을 연결하여 1~2 문장으로 친절하게 설명해주세요.** 4. 그 다음, [영상 스크립트 내용]에 근거하여 사용자가 **오늘 당장 시작할 수 있는** 구체적인 행동 계획을 3~5가지 단계로 나누어 제안해주세요. 5. 각 단계는 사용자가 쉽게 이해하고 따라 할 수 있도록 명확하고 간결하게 작성해주세요. 6. 답변은 친절하고 격려하는 말투를 사용해주세요.`;

/**
 * 영상 검색 전문가 도구
 * 사용자의 고민을 입력받아 관련 영상 후보를 검색하고, LLM으로 재랭킹하여 Top-1을 반환.
 */
// /lib/recai/tools.ts (핵심만 발췌)
export const findRelevantVideoTool = new DynamicTool({
  name: "videoSearcher",
  description:
    "사용자 고민으로 DB에서 관련 영상 후보를 찾고 상위 추천을 JSON으로 반환합니다.",
  func: async (toolInput: any) => {
    const norm = (v: any) =>
      typeof v === "string"
        ? v
        : (v?.input ?? JSON.stringify(v ?? "")).toString();

    try {
      const userQueryText = norm(toolInput);

      const cookieStore = await cookies();
      const supabase = await createClient(cookieStore);

      // 1) 키워드 추출 (실패 시 원문 사용)
      let extracted = userQueryText;
      try {
        const keywordModel = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          // @ts-ignore
          generationConfig: { responseMimeType: "application/json" },
        });
        const prompt = KEYWORD_EXTRACTION_PROMPT.replace(
          "{userQueryText}",
          userQueryText
        );
        const res = await keywordModel.generateContent(prompt);
        const kw = JSON.parse(res.response.text().trim());
        extracted =
          (kw.must?.length ? kw.must.join(" ") : kw.intent) || userQueryText;
      } catch {}

      // 2) RPC로 후보 15개
      const { data: candidates, error } = await supabase.rpc(
        "final_video_search",
        {
          query_text: extracted,
          match_count: 15,
          keyword_weight: 0.6,
          semantic_weight: 0.0, // 임베딩 전이면 0 권장
        }
      );
      if (error || !candidates?.length) {
        return JSON.stringify({
          text: "관련 영상을 찾지 못했습니다.",
          videos: [],
        });
      }

      // 3) 재랭킹(JSON 모드, 문자열 프롬프트)
      const compact = candidates.map((c: any) => ({
        id: c.id,
        video_id: c.video_id,
        title: c.title,
        summary: c.summary,
        tags: c.tags,
        channel: c.channel_name,
        published_at: c.published_at,
        duration_sec: c.duration_sec,
      }));

      const rerankModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        // @ts-ignore
        generationConfig: { responseMimeType: "application/json" },
      });

      const rerankUser = `
JSON만 반환하라.
스키마: {"ranked":[{"id":"uuid","score":0-100,"reason":"one sentence"}]}
[Intent] ${extracted}
[Rules]
- Score: relevance, freshness, completion_likelihood, diversity
- Penalize same-channel repetition, >12min
[Candidates]
${JSON.stringify(compact)}
      `.trim();

      let ranked: any = null;
      try {
        const r = await rerankModel.generateContent(rerankUser);
        ranked = JSON.parse(r.response.text());
      } catch {
        // 폴백: 점수·이유 없이 순서만
        ranked = {
          ranked: compact.slice(0, 3).map((x: any, i: number) => ({
            id: x.id,
            score: 50 - i,
            reason: "fallback",
          })),
        };
      }

      // 4) 상위 3개 조립
      const topIds = (ranked.ranked || []).slice(0, 3).map((r: any) => r.id);
      const top = compact.filter((c: any) => topIds.includes(c.id));
      const reasonById = Object.fromEntries(
        (ranked.ranked || []).map((r: any) => [
          r.id,
          { score: r.score, reason: r.reason },
        ])
      );

      const videos = top.map((v: any) => ({
        title: v.title,
        video_id: v.video_id || v.id,
        reason: reasonById[v.id]?.reason ?? undefined,
        score: reasonById[v.id]?.score ?? undefined,
        channel: v.channel,
        duration_sec: v.duration_sec ?? undefined,
        published_at: v.published_at ?? undefined,
        // summary, tags는 필요하면 UI에서 확장
      }));

      // 5) 최종 반환(JSON 문자열) — 액션 플랜 없음
      return JSON.stringify({
        text: `아래 영상이 현재 질문과 가장 잘 맞아요.`,
        videos, // [{title, video_id, reason?, score?, ...}] 최대 3개
      });
    } catch (e) {
      return JSON.stringify({
        text: "영상 추천 중 오류가 발생했습니다.",
        videos: [],
      });
    }
  },
});

/**
 * 액션 플랜 생성 전문가 도구
 */
export const createActionPlanTool = new DynamicTool({
  name: "actionPlanCreator",
  description:
    "찾은 영상을 바탕으로 사용자에게 제공할 구체적인 액션 플랜을 만들 때 사용합니다. 'userQueryText'와 'videoData'를 입력해야 합니다.",
  func: async (input: { userQueryText: string; videoData: string }) => {
    try {
      const { userQueryText, videoData } = input;
      const videoInfo = JSON.parse(videoData);

      const finalPrompt = `
JSON만 반환하라.
스키마:
{"text":"최종 답변(마크다운 허용)","videos":[{"title":"...","video_id":"..."}]}
[사용자 고민]:
${userQueryText}

[참고할 영상 제목]:
${videoInfo.videoTitle}

[영상 스크립트 내용]:
${videoInfo.videoScript}
      `.trim();

      const actionPlanModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: ACTION_PLAN_PROMPT,
        // @ts-ignore
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await actionPlanModel.generateContent(finalPrompt);

      let actionJson: any;
      try {
        actionJson = JSON.parse(result.response.text());
      } catch {
        // 방어: 텍스트만 왔을 때
        actionJson = {
          text: result.response.text(),
          videos: [
            { title: videoInfo.videoTitle, video_id: videoInfo.videoId },
          ],
        };
      }

      return JSON.stringify({
        text: actionJson.text,
        videos: actionJson.videos?.length
          ? actionJson.videos
          : [{ title: videoInfo.videoTitle, video_id: videoInfo.videoId }],
      });
    } catch (error) {
      console.error("actionPlanCreator 도구 실행 중 오류:", error);
      return "액션 플랜을 생성하는 도중 오류가 발생했습니다.";
    }
  },
});
