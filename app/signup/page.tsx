// 클라이언트 측에서 상호작용이 필요하므로 "use client" 명시
"use client";

import { useState } from "react";
// Supabase 클라이언트를 import 합니다.
import { createClient } from "@/utils/supabase/client";

const SignUpPage = () => {
  // Supabase 클라이언트 인스턴스 생성
  const supabase = createClient();

  // state 변수들: 이메일, 비밀번호, 메시지(알림용)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 비밀번호 확인을 위한 state 추가
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 회원가입 폼 제출 시 실행될 함수
  const handleSignUp = async (event) => {
    event.preventDefault(); // 폼 기본 제출 동작 방지

    // --- 비밀번호 일치 여부 확인 로직 추가 ---
    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      setIsError(true);
      return; // 함수 실행을 여기서 중단
    }
    // --- 로직 추가 끝 ---

    // Supabase의 signUp 함수 호출
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // 에러 발생 시
      console.error("회원가입 에러:", error.message);
      setMessage(`오류가 발생했습니다: ${error.message}`);
      setIsError(true);
    } else {
      // 성공 시 (이메일 확인 필요)
      setMessage("회원가입 성공! 이메일을 확인하여 계정을 활성화해주세요.");
      setIsError(false);
      setEmail(""); // 입력 필드 초기화
      setPassword("");
      setConfirmPassword(""); // 비밀번호 확인 필드도 초기화
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          회원가입
        </h1>
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일 주소
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* --- 비밀번호 확인 입력 필드 추가 --- */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 확인
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          {/* --- 필드 추가 끝 --- */}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              가입하기
            </button>
          </div>
        </form>

        {/* 성공 또는 오류 메시지 표시 */}
        {message && (
          <p
            className={`text-center text-sm ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
