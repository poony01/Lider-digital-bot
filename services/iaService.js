// services/iaService.js
import fetch from "node-fetch";

export async function responderIA(pergunta) {
  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // ou "gpt-4" se você quiser testar com plano premium
        messages: [{ role: "user", content: pergunta }],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const dados = await resposta.json();

    if (!dados.choices || !dados.choices[0]) {
      console.error("Resposta inválida da OpenAI:", dados);
      return "❌ A IA não conseguiu responder corretamente.";
    }

    return dados.choices[0].message.content.trim();
  } catch (erro) {
    console.error("Erro ao acessar a OpenAI:", erro);
    return "❌ Ocorreu um erro ao tentar responder com IA.";
  }
}
