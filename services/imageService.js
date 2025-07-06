// services/imageService.js
import fetch from "node-fetch";

export async function gerarImagem(prompt) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
  return data?.data?.[0]?.url || null;
}
