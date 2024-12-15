import OpenAI from "openai";

// Создание экземпляра Configuration и OpenAIApi
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Укажи ключ API
  dangerouslyAllowBrowser: true
});

// Типизация для ответа API
interface OpenAIResponse {
  choices: Array<{ message: { content: string } }>;
}

export const fetchOpenAIResponse = async (prompt: string): Promise<string | null> => {
  try {
    console.log("Отправка запроса: ", prompt); // Логируем prompt

    const response = await openai.chat.completions.create({
      model: "text-embedding-3-small", // Указание модели
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    }) as OpenAIResponse;

    console.log("Ответ от OpenAI: ", response); // Логируем ответ

    if (response.choices && response.choices.length > 0) {
      console.log("Текст ответа: ", response.choices[0].message.content);
      return response.choices[0].message.content; // Возвращаем ответ
    } else {
      console.error("Ответ не содержит choices.");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при вызове OpenAI API:", error); // Логируем ошибку
    throw error;
  }
};
