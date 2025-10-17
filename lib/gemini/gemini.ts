import { GoogleGenerativeAI } from "@google/generative-ai";

// .env.local 파일에서 API 키를 가져옵니다.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in .env.local");
}

// API 키를 사용하여 Gemini 클라이언트를 초기화합니다.
const genAI = new GoogleGenerativeAI(apiKey);

export default genAI;
