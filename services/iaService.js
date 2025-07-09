// services/iaService.js
import fetch from "node-fetch";
import { getMemory, saveMemory } from "./memoryService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(pergunta, userId) {
  const modelo = "gpt-4-turbo";
  const historico = await getMemory(userId);

  // Adiciona pergunta do usuário
  historico.push({ role: "user", content: pergunta });

  // Define estilo com emojis variados (sem repetição forçada)
  const mensagens = [
    {
      role: "system",
      content:
        "Você é uma assistente divertida, clara e simpática. Use diferentes emojis conforme o contexto (🎯, 🤖, 😄, ✨, 💡, etc), e nunca use o mesmo sempre. Mantenha uma conversa animada, mas natural."
    },
    ...historico
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelo,
      messages: mensagens,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const erro = await response.text();
    console.error("❌ Erro ao falar com a IA:", erro);
    return "😓 Ocorreu um erro ao falar com a IA.";
  }

  const data = await response.json();
  const resposta = data.choices?.[0]?.message?.content?.trim() || "🤖 Sem resposta da IA.";

  // Adiciona resposta da IA ao histórico
  historico.push({ role: "assistant", content: resposta });

  // Salva memória atualizada
  await saveMemory(userId, historico);

  return resposta;
}
