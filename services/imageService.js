// services/imageService.js
import fetch from "node-fetch";

export async function gerarImagem(prompt) {
  try {
    const resposta = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const data = await resposta.json();

    if (data && data.data && data.data[0] && data.data[0].url) {
      return data.data[0].url;
    } else {
      console.error("Erro ao gerar imagem:", data);
      return null;
    }
  } catch (erro) {
    console.error("Erro ao se comunicar com a API da OpenAI:", erro);
    return null;
  }
}
