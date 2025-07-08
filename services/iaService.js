// services/iaService.js
import fetch from "node-fetch";
import { getMemory, saveMemory } from "../dados/memoryService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(pergunta, userId) {
  const url = "https://api.openai.com/v1/chat/completions";
  const modelo = "gpt-4-turbo"; // ✅ sempre usando o modelo avançado

  // Carrega histórico do usuário
  const historico = await getMemory(userId);

  // Adiciona a nova pergunta ao histórico
  historico.push({ role: "user", content: pergunta });

  // Define uma instrução para o estilo das respostas
  const mensagens = [
    { role: "system", content: "Você é uma assistente inteligente, educada e simpática. Sempre responde com clareza e usa emojis para deixar a conversa animada 😊🤖✨." },
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
      Authorization: `Bearer ${OPENAI_API_KEY}`, // ✅ corrigido
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

  // Adiciona resposta da IA ao histórico
  historico.push({ role: "assistant", content: resposta });

  // Salva histórico atualizado
  await saveMemory(userId, historico);

  return resposta;
}
