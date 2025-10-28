import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// 인증번호를 임시 저장할 Map (프로덕션에서는 Redis 사용 권장)
const verificationCodes = new Map<
  string,
  { code: string; expiresAt: number }
>();

// 6자리 랜덤 인증번호 생성
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// HMAC-SHA256 서명 생성
function makeSignature(
  method: string,
  url: string,
  timestamp: string,
  accessKey: string,
  secretKey: string
): string {
  const space = " ";
  const newLine = "\n";
  const hmac = crypto.createHmac("sha256", secretKey);
  const message = [
    method,
    space,
    url,
    newLine,
    timestamp,
    newLine,
    accessKey,
  ].join("");
  return hmac.update(message).digest("base64");
}

// POST: 인증번호 발송
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    // 전화번호 형식 검증
    const phoneRegex = /^01[0-9]{8,9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/-/g, ""))) {
      return NextResponse.json(
        { error: "올바른 전화번호 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 인증번호 생성
    const verificationCode = generateVerificationCode();

    // 5분 후 만료
    const expiresAt = Date.now() + 5 * 60 * 1000;
    verificationCodes.set(phoneNumber, { code: verificationCode, expiresAt });

    // 네이버 클라우드 API 설정
    const serviceId = process.env.NAVER_CLOUD_SERVICE_ID!;
    const accessKey = process.env.NAVER_CLOUD_ACCESS_KEY!;
    const secretKey = process.env.NAVER_CLOUD_SECRET_KEY!;
    const fromNumber = process.env.NAVER_CLOUD_PHONE_NUMBER!;

    const timestamp = Date.now().toString();
    const method = "POST";
    const url = `/sms/v2/services/${serviceId}/messages`;
    const signature = makeSignature(
      method,
      url,
      timestamp,
      accessKey,
      secretKey
    );

    // SMS 발송
    const response = await fetch(
      `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-iam-access-key": accessKey,
          "x-ncp-apigw-signature-v2": signature,
        },
        body: JSON.stringify({
          type: "SMS",
          contentType: "COMM",
          countryCode: "82",
          from: fromNumber,
          content: `[Foundary] 인증번호는 [${verificationCode}] 입니다.`,
          messages: [
            {
              to: phoneNumber,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("SMS 발송 실패:", errorData);
      return NextResponse.json(
        { error: "SMS 발송에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "인증번호가 발송되었습니다.",
    });
  } catch (error) {
    console.error("SMS 발송 에러:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PUT: 인증번호 확인
export async function PUT(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();

    const stored = verificationCodes.get(phoneNumber);

    if (!stored) {
      return NextResponse.json(
        { error: "인증번호를 먼저 요청해주세요." },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(phoneNumber);
      return NextResponse.json(
        { error: "인증번호가 만료되었습니다. 다시 요청해주세요." },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      return NextResponse.json(
        { error: "인증번호가 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // 인증 성공 후 삭제
    verificationCodes.delete(phoneNumber);

    return NextResponse.json({
      success: true,
      message: "인증이 완료되었습니다.",
    });
  } catch (error) {
    console.error("인증번호 확인 에러:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
