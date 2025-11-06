"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  content: string;
  status: "pending" | "in_progress" | "completed";
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
  replied_at: string | null;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 문의 목록 불러오기
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      let query = supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log("불러온 문의 목록:", data);
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      alert("문의 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filterStatus]);

  // 문의 상태 변경 (디버깅 버전)
  const updateStatus = async (id: string, newStatus: Inquiry["status"]) => {
    console.log("=== 상태 변경 시작 ===");
    console.log("문의 ID:", id);
    console.log("새 상태:", newStatus);
    console.log("상태 타입:", typeof newStatus);

    try {
      const supabase = createClient();

      // 먼저 현재 데이터 확인
      const { data: beforeData } = await supabase
        .from("inquiries")
        .select("*")
        .eq("id", id)
        .single();

      console.log("변경 전 데이터:", beforeData);

      // 업데이트 실행
      const { data, error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", id)
        .select();

      console.log("업데이트 응답:", { data, error });

      if (error) {
        console.error("❌ Supabase 에러:", error);
        alert(`상태 변경 실패: ${error.message}\n코드: ${error.code}`);
        return;
      }

      if (!data || data.length === 0) {
        console.error("❌ 업데이트된 데이터 없음");
        alert("문의를 찾을 수 없거나 권한이 없습니다.");
        return;
      }

      console.log("✅ 업데이트 성공:", data[0]);

      // 선택된 문의가 있으면 상태 업데이트
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({
          ...selectedInquiry,
          status: newStatus,
        });
      }

      // 목록 새로고침
      await fetchInquiries();

      alert("✅ 상태가 변경되었습니다!");
    } catch (error: any) {
      console.error("❌ 예외 발생:", error);
      alert(`상태 변경 중 오류: ${error.message || "알 수 없는 오류"}`);
    }
  };

  // 답변 저장 및 이메일 발송
  const handleReplySubmit = async () => {
    if (!selectedInquiry || !replyText.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();

      // 1. DB에 답변 저장
      const { error: dbError } = await supabase
        .from("inquiries")
        .update({
          admin_reply: replyText.trim(),
          status: "completed",
          replied_at: new Date().toISOString(),
        })
        .eq("id", selectedInquiry.id);

      if (dbError) throw dbError;

      // 2. 이메일 발송
      try {
        const emailResponse = await fetch("/api/send-inquiry-reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: selectedInquiry.email,
            name: selectedInquiry.name,
            content: selectedInquiry.content,
            reply: replyText.trim(),
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error("Email sending failed:", errorData);
          alert(
            "답변이 저장되었으나 이메일 발송에 실패했습니다.\n수동으로 발송해주세요."
          );
        } else {
          alert("답변이 저장되고 이메일이 발송되었습니다! ✅");
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        alert(
          "답변이 저장되었으나 이메일 발송 중 오류가 발생했습니다.\n문의자에게 직접 연락해주세요."
        );
      }

      setSelectedInquiry(null);
      setReplyText("");
      fetchInquiries();
    } catch (error) {
      console.error("Error saving reply:", error);
      alert("답변 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 문의 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 문의를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.from("inquiries").delete().eq("id", id);

      if (error) throw error;

      alert("문의가 삭제되었습니다.");
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("문의 삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">문의 관리</h1>
        <p className="text-gray-600">
          고객 문의를 관리하고 답변할 수 있습니다.
        </p>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterStatus === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          전체 ({inquiries.length})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterStatus === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          대기중
        </button>
        <button
          onClick={() => setFilterStatus("in_progress")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterStatus === "in_progress"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          처리중
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterStatus === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          완료
        </button>
      </div>

      {/* 문의 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            문의가 없습니다.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  문의일시
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={inquiry.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        console.log("드롭다운 변경:", e.target.value);
                        updateStatus(
                          inquiry.id,
                          e.target.value as Inquiry["status"]
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                        inquiry.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : inquiry.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <option value="pending">대기중</option>
                      <option value="in_progress">처리중</option>
                      <option value="completed">완료</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inquiry.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(inquiry.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setReplyText(inquiry.admin_reply || "");
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      상세보기
                    </button>
                    <button
                      onClick={() => handleDelete(inquiry.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 상세보기 모달 */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">문의 상세</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) =>
                    updateStatus(
                      selectedInquiry.id,
                      e.target.value as Inquiry["status"]
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">대기중</option>
                  <option value="in_progress">처리중</option>
                  <option value="completed">완료</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <p className="text-gray-900">{selectedInquiry.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <p className="text-gray-900">{selectedInquiry.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  문의일시
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedInquiry.created_at)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  문의 내용
                </label>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedInquiry.content}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  답변
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="답변 내용을 입력하세요..."
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "저장중..." : "답변 저장 및 이메일 발송"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
