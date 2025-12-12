"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

interface InquiryFormData {
  name: string;
  email: string;
  content: string;
}

export default function InquiryForm() {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    email: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setSubmitStatus({
        type: "error",
        message: "이름을 입력해주세요.",
      });
      return false;
    }

    if (!formData.email.trim()) {
      setSubmitStatus({
        type: "error",
        message: "이메일을 입력해주세요.",
      });
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "올바른 이메일 형식을 입력해주세요.",
      });
      return false;
    }

    if (!formData.content.trim()) {
      setSubmitStatus({
        type: "error",
        message: "문의 내용을 입력해주세요.",
      });
      return false;
    }

    if (formData.content.trim().length < 10) {
      setSubmitStatus({
        type: "error",
        message: "문의 내용은 최소 10자 이상 입력해주세요.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("inquiries")
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            content: formData.content.trim(),
            status: "pending",
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      // 성공
      setSubmitStatus({
        type: "success",
        message:
          "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.",
      });

      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        content: "",
      });

      // 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      setSubmitStatus({
        type: "error",
        message: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">1:1 문의</h1>
        <p className="text-gray-600">
          궁금하신 사항을 남겨주시면 빠른 시일 내에 답변드리겠습니다.
        </p>
      </div>

      {/* 상태 메시지 */}
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${submitStatus.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
            }`}
        >
          <p className="font-medium">{submitStatus.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 입력 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="홍길동"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>

        {/* 이메일 입력 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            답변받으실 이메일 주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            disabled={isSubmitting}
            maxLength={255}
          />
        </div>

        {/* 문의 내용 입력 */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            문의 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="문의하실 내용을 자세히 작성해주세요. (최소 10자 이상)"
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            disabled={isSubmitting}
            maxLength={2000}
          />
          <p className="mt-2 text-sm text-gray-500">
            {formData.content.length} / 2000자
          </p>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800"
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              제출 중...
            </span>
          ) : (
            "문의하기"
          )}
        </button>
      </form>

      {/* 안내 사항 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">📌 안내사항</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>문의하신 내용은 영업일 기준 1-2일 내로 답변드립니다.</li>
          <li>답변은 입력하신 이메일 주소로 발송됩니다.</li>
          <li>스팸 메일함도 확인해주세요.</li>
          <li>긴급한 문의는 foundary1201@gmail.com로 직접 메일을 보내주세요.</li>
        </ul>
      </div>
    </div>
  );
}
