// app/login/page.tsx
"use client";

import { signIn } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/client";
import type { Provider } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 아이콘 컴포넌트들...
const KakaoIcon = () => (/* ... */);
const GoogleIcon = () => (/* ... */);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Server Action 호출
    const result = await signIn(email, password);
    
    if (result.error) {
      alert("로그인 정보가 올바르지 않습니다.");
      return;
    }
    
    // Server Action에서 이미 revalidate했으므로
    // 그냥 push만 하면 됨
    router.push("/");
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