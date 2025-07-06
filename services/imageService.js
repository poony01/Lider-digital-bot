// services/imageService.js
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

export async function gerarImagem(prompt) {
  try {
    const response = await openai.createImage({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024"
    });

    return response.data.data[0].url;
  } catch (error) {
    console.error("Erro em gerarImagem:", error.response?.data || error.message);
    return null;
  }
}
