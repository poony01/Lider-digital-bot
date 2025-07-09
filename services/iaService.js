// services/iaService.js
import fetch from "node-fetch";
import { getMemory, saveMemory } from "./memoryService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(pergunta, userId) {
  const url = "https://api.openai.com/v1/chat/completions";
  const modelo = "gpt-4-turbo";

  const historico = await getMemory(userId);
  historico.push({ role: "user", content: pergunta });

  // ✅ Define a data atual do sistema
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // ✅ Mensagem de sistema com a data incluída
  const mensagens = [
    {
      role: "system",
      content: `Você é uma assistente inteligente, educada e simpática. Hoje é ${dataAtual}. Sempre responda com clareza e use diferentes emojis para deixar a conversa mais divertida e variada como 🤖✨🎉😉🧠.`
    },
    ...historico
  ];

  const body = {
    model: modelo,
    messages: mensagens,
    temperature: 0.7
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const erro = await response.text();
    console.error("❌ Erro ao falar com a IA:", erro);
    return "😓 Desculpe, ocorreu um erro ao falar com a IA.";
  }

  const data = await response.json();
  const resposta = data.choices?.[0]?.message?.content?.trim() || "🤖 Sem resposta da IA.";

  historico.push({ role: "assistant", content: resposta });
  await saveMemory(userId, historico);

  return resposta;
}
