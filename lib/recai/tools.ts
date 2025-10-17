// /lib/recai/tools.ts

import genAI from "@/lib/gemini/gemini";
import { createClient } from "@/utils/supabase/server";
import { DynamicTool } from "langchain/tools";
import { cookies } from "next/headers";

const KEYWORD_EXTRACTION_PROMPT = `주어진 [사용자 고민] 전체를 분석하여, 데이터베이스에서 관련 영상을 검색하는 데 사용할 가장 핵심적인 키워드를 3개에서 5개 사이로 추출해줘. 결과는 반드시 쉼표(,)로 구분된 하나의 문자열로 제공해야 해. 다른 설명이나 줄바꿈은 절대 추가하지 마. [사용자 고민]: {userQueryText} [검색 키워드]:`;
const ACTION_PLAN_PROMPT = `당신은 사용자의 문제를 해결하기 위해, 주어진 영상 자료를 바탕으로 구체적이고 실천 가능한 액션 플랜을 제안하는 전문 코치입니다. 규칙: 1. 주어진 [사용자 고민]과 [영상 스크립트 내용]을 깊이 있게 분석하세요. 2. 가장 먼저, 어떤 영상을 기반으로 조언하는지 명확하게 언급하며 영상을 추천해주세요. 3. **[매우 중요] 왜 이 영상이 사용자의 고민 해결에 도움이 되는지, 영상의 핵심 원리와 사용자의 상황을 연결하여 1~2 문장으로 친절하게 설명해주세요.** 4. 그 다음, [영상 스크립트 내용]에 근거하여 사용자가 **오늘 당장 시작할 수 있는** 구체적인 행동 계획을 3~5가지 단계로 나누어 제안해주세요. 5. 각 단계는 사용자가 쉽게 이해하고 따라 할 수 있도록 명확하고 간결하게 작성해주세요. 6. 답변은 친절하고 격려하는 말투를 사용해주세요.`;

/**
 * 영상 검색 전문가 도구
 * 사용자의 고민을 입력받아 가장 관련성 높은 영상을 Supabase DB에서 찾아 반환합니다.
 */
export const findRelevantVideoTool = new DynamicTool({
  name: "videoSearcher",
  description:
    "사용자의 고민을 해결해 줄 영상을 데이터베이스에서 검색할 때 사용합니다. 사용자의 원래 고민 전체를 입력으로 사용해야 합니다.",
  func: async (userQueryText: string) => {
    try {
      console.log(
        `[도구 호출] videoSearcher (키워드 전용) 실행. 입력: "${userQueryText}"`
      );
      const cookieStore = cookies();
      const supabase = await createClient(cookieStore);

      // 1. AI를 이용한 키워드 추출 (이 부분은 그대로 사용)
      const KEYWORD_EXTRACTION_PROMPT = `주어진 [사용자 고민] 전체를 분석하여, 데이터베이스에서 관련 영상을 검색하는 데 사용할 가장 핵심적인 키워드를 3개에서 5개 사이로 추출해줘. 결과는 반드시 쉼표(,)로 구분된 하나의 문자열로 제공해야 해. 다른 설명이나 줄바꿈은 절대 추가하지 마. [사용자 고민]: {userQueryText} [검색 키워드]:`;
      const keywordModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
      const keywordPrompt = KEYWORD_EXTRACTION_PROMPT.replace(
        "{userQueryText}",
        userQueryText
      );
      const keywordResult = await keywordModel.generateContent(keywordPrompt);
      const extractedKeywords = keywordResult.response.text().trim();
      console.log(`[도구 내부] 추출된 키워드: ${extractedKeywords}`);

      // 2. 쉼표로 구분된 키워드를 OR 검색 쿼리로 변환
      // ex: "자판기,사업" -> "title.ilike.%자판기%,tags.ilike.%자판기%,summary.ilike.%자판기%,title.ilike.%사업%,..."
      const orQuery = extractedKeywords
        .split(",")
        .map(
          (keyword) =>
            `title.ilike.%${keyword.trim()}%,tags.ilike.%${keyword.trim()}%,summary.ilike.%${keyword.trim()}%`
        )
        .join(",");

      // 3. 새로 만든 'keyword_video_search' 함수를 호출합니다.
      const { data: matchedVideos, error } = await supabase.rpc(
        "final_video_search",
        {
          query_text: extractedKeywords, // <--- .replace()를 모두 제거하고 원본 키워드를 그대로 전달!
          match_count: 1,
        }
      );

      if (error || !matchedVideos || matchedVideos.length === 0) {
        console.error("키워드 검색 실패:", error);
        return "관련 영상을 찾지 못했습니다. 데이터베이스에 해당 키워드의 영상이 없는 것 같습니다.";
      }

      const topVideo = matchedVideos[0];
      console.log(`[도구 내부] 찾은 영상: ${topVideo.title}`);

      // 4. 영상 스크립트 조각(Chunk) 가져오기
      const { data: topVideoChunks } = await supabase
        .from("video_chunks")
        .select("chunk_text")
        .eq("video_id", topVideo.id) // video_id가 아닌 video의 id(uuid)로 검색
        .limit(10);

      const contextText =
        topVideoChunks
          ?.map((chunk: any) => `- "${chunk.chunk_text}"`)
          .join("\n") || "";

      // 도구의 최종 결과물
      return JSON.stringify({
        videoTitle: topVideo.title,
        videoId: topVideo.video_id,
        videoScript: contextText,
      });
    } catch (error) {
      console.error("videoSearcher 도구 실행 중 오류:", error);
      return "영상을 검색하는 도중 오류가 발생했습니다.";
    }
  },
});

/**
 * 액션 플랜 생성 전문가 도구
 * 사용자 고민과 영상 정보를 바탕으로 구체적인 실천 계획을 생성합니다.
 */
export const createActionPlanTool = new DynamicTool({
  name: "actionPlanCreator",
  description:
    "찾은 영상을 바탕으로 사용자에게 제공할 구체적인 액션 플랜을 만들 때 사용합니다. 'userQueryText'와 'videoData'를 입력해야 합니다.",
  func: async (input: { userQueryText: string; videoData: string }) => {
    try {
      console.log(`[도구 호출] actionPlanCreator 실행.`);
      const { userQueryText, videoData } = input;
      const videoInfo = JSON.parse(videoData);

      // 1. 최종 프롬프트 구성
      const finalPrompt = `[사용자 고민]:\n${userQueryText}\n\n[참고할 영상 제목]:\n${videoInfo.videoTitle}\n\n[영상 스크립트 내용]:\n${videoInfo.videoScript}`;

      // 2. 액션 플랜 모델 호출
      const actionPlanModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: ACTION_PLAN_PROMPT,
      });
      const result = await actionPlanModel.generateContent(finalPrompt);
      const actionPlanText = result.response.text();
      console.log(`[도구 내부] 액션 플랜 생성 완료.`);

      // 3. 최종 답변과 영상 정보를 함께 반환
      // API 응답 구조와 맞추기 위해 JSON 문자열로 반환
      return JSON.stringify({
        text: actionPlanText,
        videos: [
          {
            title: videoInfo.videoTitle,
            video_id: videoInfo.videoId,
          },
        ],
      });
    } catch (error) {
      console.error("actionPlanCreator 도구 실행 중 오류:", error);
      return "액션 플랜을 생성하는 도중 오류가 발생했습니다.";
    }
  },
});
