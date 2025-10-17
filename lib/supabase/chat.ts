import { createClient } from "@/utils/supabase/server";

// Supabase 클라이언트를 생성하는 함수 (서버 컴포넌트용)
async function getSupabaseClient() {
  return createClient();
}

/**
 * 대화 내용을 DB에 저장하거나 업데이트하는 함수
 * @param chatId - 기존 채팅 ID (없으면 null)
 * @param userId - 현재 로그인한 사용자 ID
 * @param messages - 저장할 전체 메시지 배열
 * @returns { id: string } - 생성되거나 업데이트된 채팅방의 ID
 */
export async function saveOrUpdateChat(
  chatId: string | null,
  userId: string,
  messages: any[]
) {
  const supabase = await getSupabaseClient();

  if (chatId) {
    // chatId가 있으면 기존 대화 업데이트
    const { error } = await supabase
      .from("conversations") // 'conversations'는 실제 테이블 이름이어야 합니다.
      .update({ messages: messages, updated_at: new Date().toISOString() })
      .eq("id", chatId)
      .eq("user_id", userId); // 보안: 현재 유저의 채팅방만 수정 가능하도록

    if (error) {
      console.error("Error updating chat:", error);
      throw new Error("대화 내용을 업데이트하는 데 실패했습니다.");
    }
    return { id: chatId };
  } else {
    // chatId가 없으면 새 대화 생성
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        messages: messages,
      })
      .select("id") // 새로 생성된 row의 id를 반환받음
      .single();

    if (error || !data) {
      console.error("Error creating new chat:", error);
      throw new Error("새로운 대화방을 생성하는 데 실패했습니다.");
    }
    return { id: data.id };
  }
}
