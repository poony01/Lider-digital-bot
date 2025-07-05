// services/iaService.js
import fetch from "node-fetch";

export async function responderIA(pergunta, modelo = "gpt-3.5-turbo") {
  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelo,
        messages: [{ role: "user", content: pergunta }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const dados = await resposta.json();
    return dados.choices?.[0]?.message?.content?.trim() || "❌ Não consegui entender sua pergunta.";
  } catch (erro) {
    console.error("Erro na IA:", erro);
    return "❌ Ocorreu um erro ao tentar responder com IA.";
  }
}
