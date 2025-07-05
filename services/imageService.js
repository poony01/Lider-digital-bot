// services/imageService.js
import fetch from 'node-fetch';

export async function gerarImagem(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;

  const body = {
    prompt,
    n: 1,
    size: "1024x1024"
  };

  const resposta = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const dados = await resposta.json();
  return dados.data?.[0]?.url || null;
}
