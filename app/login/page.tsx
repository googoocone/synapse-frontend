"use client";

import { createClient } from "@/utils/supabase/client"; // @supabase/ssr의 클라이언트 함수
import type { Provider } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 아이콘 SVG 컴포넌트들
const KakaoIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20">
    <path
      fill="#3C1E1E"
      d="M16 4.64c-6.96 0-12.64 4.48-12.64 10.08 0 3.52 2.24 6.64 5.44 8.48l-1.92 5.44 5.68-3.6c.48.08.96.16 1.44.16 6.96 0 12.64-4.48 12.64-10.08S22.96 4.64 16 4.64z"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인 정보가 올바르지 않습니다.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-b-lg">
        <h2 className="text-xl font-semibold text-center mb-6">로그인</h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
            className="w-full px-4 py-3.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm "
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            className="w-full px-4 py-3.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
          />
          <button
            type="submit"
            className="w-full py-3.5 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
          >
            로그인
          </button>
        </form>

        <div className="flex justify-center items-center text-xs text-gray-500 mt-4 space-x-4">
          <Link href="/signup" className="hover:underline">
            Sign Up
          </Link>
          <Link href="/forgot-password">Forgot Password</Link>
          <Link href="/contact">Contact Us</Link>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-400">or</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* <button
            onClick={() => handleOAuthSignIn("kakao")}
            className="w-full py-3.5 bg-[#FEE500] text-black text-sm font-medium rounded-full flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors cursor-pointer"
          >
            <KakaoIcon />
            카카오로 로그인
          </button> */}
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <GoogleIcon />
            구글로 로그인
          </button>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/privacy"
            className="text-xs text-gray-400 hover:underline"
          >
            개인정보 보호 정책
          </Link>
        </div>
      </div>
    </div>
  );
}
