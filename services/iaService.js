// services/iaService.js
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export async function responderIA(pergunta) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: pergunta }],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao responder com IA:", error);
    return "❌ Erro ao responder. Tente novamente.";
  }
}
