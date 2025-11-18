/*
IMPORTANT NOTICE: DO NOT REMOVE
This is a custom client for the OpenAI API. You may update this service, but you should not need to.

valid model names:
gpt-4.1-2025-04-14
o4-mini-2025-04-16
gpt-4o-2024-11-20
*/
import OpenAI from "openai";

export const getOpenAIClient = () => {
  // ใช้ API key ของคุณเอง (EXPO_PUBLIC_OPENAI_API_KEY)
  // ถ้าไม่มี จะใช้ของ Vibecode แทน (สำหรับ dev เท่านั้น)
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === "your-openai-api-key-here") {
    throw new Error(
      "❌ กรุณาเพิ่ม OpenAI API key ของคุณในไฟล์ .env\n" +
      "ใส่ค่า EXPO_PUBLIC_OPENAI_API_KEY=sk-xxx...\n" +
      "สมัครได้ที่: https://platform.openai.com/api-keys"
    );
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Enable for development
  });
};
