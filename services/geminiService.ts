import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (
  goal: number,
  saved: number,
  daysLeft: number
): Promise<string> => {
  if (!apiKey) {
    return "API ключ не найден. Продолжайте копить, вы молодец!";
  }

  try {
    const prompt = `
      Пользователь проходит челлендж по накоплению денег.
      Цель: ${goal} рублей.
      Уже накоплено: ${saved} рублей.
      Осталось дней: ${daysLeft}.
      
      Дай короткий, мотивирующий совет или интересную финансовую мудрость (максимум 2 предложения), 
      чтобы поддержать пользователя. Будь дружелюбным и позитивным. 
      Если осталось мало дней, поздравь с финальной прямой.
      Отвечай на русском языке.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "У вас отлично получается, так держать!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Маленькие шаги приводят к большим целям. Продолжайте!";
  }
};
