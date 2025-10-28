"use client";

import { createClient } from "@/utils/supabase/client";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 전화번호 인증 관련 state
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);

  // 성공 모달 state 추가
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 전화번호 형식 자동 변환 (010-1234-5678)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  // 타이머 시작
  const startTimer = () => {
    setTimer(300);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 인증번호 발송
  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.replace(/-/g, "").length < 10) {
      setMessage("올바른 전화번호를 입력해주세요.");
      setIsError(true);
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.replace(/-/g, "") }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("인증번호가 발송되었습니다.");
        setIsError(false);
        setIsCodeSent(true);
        startTimer();
      } else {
        setMessage(data.error || "인증번호 발송에 실패했습니다.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("네트워크 오류가 발생했습니다.");
      setIsError(true);
    } finally {
      setIsSending(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage("6자리 인증번호를 입력해주세요.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch("/api/send-sms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/-/g, ""),
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("전화번호 인증이 완료되었습니다.");
        setIsError(false);
        setIsVerified(true);
        setTimer(0);
      } else {
        setMessage(data.error || "인증번호가 일치하지 않습니다.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("네트워크 오류가 발생했습니다.");
      setIsError(true);
    }
  };

  // 회원가입
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      setIsError(true);
      return;
    }

    if (!isVerified) {
      setMessage("전화번호 인증을 완료해주세요.");
      setIsError(true);
      return;
    }

    // 1. Supabase Auth에 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone: phoneNumber.replace(/-/g, ""),
        },
      },
    });

    if (error) {
      setMessage(`오류가 발생했습니다: ${error.message}`);
      setIsError(true);
      return;
    }

    // 2. profiles 테이블에 저장 (트리거가 실패할 경우를 대비)
    if (data.user) {
      // 잠시 대기 (트리거가 실행될 시간)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 프로필이 이미 생성되었는지 확인
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      // 프로필이 없으면 직접 생성
      if (!existingProfile) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: email,
          phone: phoneNumber.replace(/-/g, ""),
        });

        if (profileError) {
          console.error("프로필 생성 실패:", profileError);
          // 에러가 있어도 회원가입은 완료된 상태이므로 계속 진행
        }
      }
    }

    // 3. 성공 모달 표시
    setShowSuccessModal(true);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            회원가입
          </h1>
          <form className="space-y-6" onSubmit={handleSignUp}>
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="you@example.com"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="••••••••"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                placeholder="••••••••"
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(formatPhoneNumber(e.target.value))
                  }
                  disabled={isVerified}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] disabled:bg-gray-100"
                  placeholder="010-1234-5678"
                  maxLength={13}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSending || isVerified || timer > 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF7A00] rounded-md hover:bg-[#FF7A00]/90 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isVerified
                    ? "인증완료"
                    : timer > 0
                    ? `재발송(${Math.floor(timer / 60)}:${(timer % 60)
                        .toString()
                        .padStart(2, "0")})`
                    : isSending
                    ? "발송중..."
                    : "인증번호"}
                </button>
              </div>
            </div>

            {/* 인증번호 입력 */}
            {isCodeSent && !isVerified && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  인증번호
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    placeholder="6자리 숫자"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#FF7A00] rounded-md hover:bg-[#FF7A00]/90 whitespace-nowrap"
                  >
                    확인
                  </button>
                </div>
                {timer > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    남은 시간: {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </p>
                )}
              </div>
            )}

            {/* 가입하기 버튼 */}
            <button
              type="submit"
              disabled={!isVerified}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#FF7A00] rounded-md hover:bg-[#FF7A00]/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              가입하기
            </button>
          </form>

          {/* 에러 메시지 */}
          {message && isError && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* 성공 아이콘 */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* 제목 */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
              회원가입 성공! 🎉
            </h2>

            {/* 메시지 */}
            <div className="space-y-4 mb-6">
              <p className="text-center text-gray-700">
                <span className="font-semibold text-[#FF7A00]">{email}</span>로
                <br />
                인증 이메일을 발송했어요!
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  📧 <span className="font-semibold">이메일 확인 필수!</span>
                  <br />
                  받은 편지함을 확인하고 인증 링크를 클릭하여 계정을
                  활성화해주세요.
                </p>
              </div>

              <p className="text-xs text-gray-500 text-center">
                이메일이 오지 않았나요? 스팸 메일함을 확인해보세요.
              </p>
            </div>

            {/* 버튼 */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/login");
              }}
              className="w-full px-6 py-3 bg-[#FF7A00] text-white font-semibold rounded-lg hover:bg-[#FF7A00]/90 transition-colors"
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
