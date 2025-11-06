import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { to, name, content, reply } = await request.json();

    // 유효성 검사
    if (!to || !name || !reply) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // Nodemailer transporter 설정
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // 예: smtp.gmail.com
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // 발송 이메일 주소
        pass: process.env.SMTP_PASSWORD, // 앱 비밀번호
      },
    });

    // 이메일 옵션 설정
    const mailOptions = {
      from: {
        name: "foundary",
        address: process.env.SMTP_USER || "noreply@foundary.kr",
      },
      to: to,
      subject: "[foundary] 문의하신 내용에 대한 답변입니다",
      // 이메일 HTML 템플릿 (개선 버전)
      // api-send-inquiry-reply-nodemailer.ts의 html 부분을 이것으로 교체하세요

      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
      <tr>
        <td align="center">
          <!-- 이메일 컨테이너 -->
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 600px;">
            
            <!-- 헤더 -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">foundary</h1>
                <p style="margin: 12px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 15px;">문의 답변이 도착했습니다 ✨</p>
              </td>
            </tr>
            
            <!-- 본문 -->
            <tr>
              <td style="padding: 40px 30px;">
                
                <!-- 인사말 -->
                <div style="font-size: 16px; margin-bottom: 30px; color: #333; line-height: 1.6;">
                  안녕하세요, <strong style="color: #667eea; font-weight: 600;">${name}</strong>님!<br>
                  문의하신 내용에 대한 답변을 보내드립니다.
                </div>
                
                <!-- 간격 (30px) -->
                <div style="height: 30px;"></div>
                
                <!-- 문의 내용 섹션 -->
                <div style="margin-bottom: 40px;">
                  <div style="font-size: 13px; font-weight: 700; color: #666; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.8px;">
                    <span style="display: inline-block; width: 4px; height: 16px; background: #667eea; margin-right: 8px; border-radius: 2px; vertical-align: middle;"></span>
                    📩 문의하신 내용
                  </div>
                  <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word; font-size: 14px; line-height: 1.7; color: #555;">
                    ${content.replace(/\n/g, "<br>")}
                  </div>
                </div>
                
                <!-- 간격 (40px) -->
                <div style="height: 40px;"></div>
                
                <!-- 답변 섹션 -->
                <div style="margin-bottom: 40px;">
                  <div style="font-size: 13px; font-weight: 700; color: #666; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.8px;">
                    <span style="display: inline-block; width: 4px; height: 16px; background: #667eea; margin-right: 8px; border-radius: 2px; vertical-align: middle;"></span>
                    💬 답변
                  </div>
                  <div style="background: #ffffff; padding: 20px; border: 2px solid #667eea; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word; font-size: 15px; line-height: 1.7; color: #333;">
                    ${reply.replace(/\n/g, "<br>")}
                  </div>
                </div>
                
                <!-- 간격 (40px) -->
                <div style="height: 40px;"></div>
                
                <!-- 맺음말 -->
                <div style="margin-top: 30px; font-size: 14px; color: #666; line-height: 1.6;">
                  추가 문의사항이 있으시거나 더 도움이 필요하시면<br>
                  언제든지 연락 주시기 바랍니다. 😊
                </div>
                
              </td>
            </tr>
            
            <!-- 푸터 -->
            <tr>
              <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="font-weight: 700; font-size: 16px; color: #333; margin: 0 0 12px 0;">foundary</p>
                <p style="font-size: 13px; color: #666; margin: 6px 0;">1인 창업 성공의 시작</p>
                <p style="font-size: 13px; color: #666; margin: 6px 0;">이메일: snu910501@naver.com</p>
                <p style="font-size: 13px; color: #666; margin: 6px 0;">웹사이트: <a href="https://foundary.kr" style="color: #667eea; text-decoration: none;">https://foundary.kr</a></p>
                
                <!-- 간격 (16px) -->
                <div style="height: 16px; border-top: 1px solid #e0e0e0; margin-top: 16px;"></div>
                
                <p style="font-size: 12px; color: #999; margin: 16px 0 0 0;">
                  본 메일은 발신 전용입니다. 답장하지 말아주세요.<br>
                  문의사항은 웹사이트를 통해 남겨주시기 바랍니다.
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
      // 텍스트 버전 (HTML을 지원하지 않는 이메일 클라이언트용)
      text: `
안녕하세요, ${name}님!

문의하신 내용에 대한 답변을 보내드립니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📩 문의하신 내용
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${content}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 답변
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${reply}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

추가 문의사항이 있으시면 언제든지 연락 주세요.

foundary
이메일: snu910501@naver.com
웹사이트: https://foundary.kr

본 메일은 발신 전용입니다.
      `.trim(),
    };

    // 이메일 발송
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("Email sending error:", error);

    // 상세한 에러 정보 반환
    return NextResponse.json(
      {
        error: "이메일 발송에 실패했습니다.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// 이메일 연결 테스트용 GET 엔드포인트 (개발용)
export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // SMTP 연결 테스트
    await transporter.verify();

    return NextResponse.json({
      success: true,
      message: "SMTP 연결 성공",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "SMTP 연결 실패",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
