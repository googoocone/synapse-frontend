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

  // 회원가입 로딩 state
  const [isSigningUp, setIsSigningUp] = useState(false);

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

    try {
      setIsSigningUp(true);

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
    } catch (error) {
      setMessage("알 수 없는 오류가 발생했습니다.");
      setIsError(true);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-4 space-y-6 bg-white rounded-lg shadow-md md:p-8">
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
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5833]"
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
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5833]"
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
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5833]"
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
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5833] disabled:bg-gray-100"
                  placeholder="010-1234-5678"
                  maxLength={13}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSending || isVerified || timer > 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#ff5833] rounded-md hover:bg-[#ff5833]/90 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
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
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5833]"
                    placeholder="6자리 숫자"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#ff5833] rounded-md hover:bg-[#ff5833]/90 whitespace-nowrap"
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
              disabled={!isVerified || isSigningUp}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#ff5833] rounded-md hover:bg-[#ff5833]/90 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center"
            >
              {isSigningUp ? (
                <>
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
                  가입 중...
                </>
              ) : (
                "가입하기"
              )}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* 상단 디자인 바 */}
            <div className="h-4 bg-gradient-to-r from-[#ff5833] to-[#ff8c33]"></div>

            <div className="p-8 md:p-10">
              {/* 성공 아이콘 */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center ring-4 ring-orange-100">
                  <div className="w-20 h-20 bg-[#ff5833] rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-4 tracking-tight">
                회원가입 완료!
              </h2>

              {/* 메시지 */}
              <div className="space-y-6 mb-8 text-center">
                <p className="text-lg text-gray-600">
                  <span className="font-bold text-gray-900 border-b-2 border-orange-200">
                    {email}
                  </span>
                  로<br /> 인증 메일을 발송했습니다.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left transform transition-transform hover:scale-105 duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-2xl">
                      📩
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 text-lg mb-1">
                        이메일 인증이 필요해요!
                      </h3>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        계정을 활성화하려면 이메일함에서{" "}
                        <span className="font-bold underline">인증 링크</span>를
                        꼭 클릭해주세요. 인증을 완료해야 로그인이 가능합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 bg-gray-50 py-3 px-4 rounded-lg inline-block">
                  메일이 보이지 않는다면 <span className="font-semibold text-gray-700">스팸 메일함</span>을 확인해주세요.
                </p>
              </div>

              {/* 버튼 */}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/login");
                }}
                className="w-full px-6 py-4 bg-[#ff5833] text-white text-lg font-bold rounded-xl hover:bg-[#ff7a5c] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>로그인하러 가기</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
