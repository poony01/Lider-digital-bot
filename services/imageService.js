// services/imageService.js
import fetch from "node-fetch";

export async function gerarImagem(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro ao gerar imagem:", data.error);
      return null;
    }

    return data.data[0].url;

  } catch (error) {
    console.error("Erro ao gerar imagem:", error.message);
    return null;
  }
}
