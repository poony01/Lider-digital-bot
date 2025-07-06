// services/iaService.js
import fetch from "node-fetch";
import { obterHistorico, adicionarAoHistorico } from "./memoryService.js";

export async function responderIA(pergunta, modelo = "gpt-3.5-turbo", chatId = null) {
  const historico = chatId ? obterHistorico(chatId) : [];

  historico.push({ role: "user", content: pergunta });

  const body = {
    model: modelo,
    messages: historico.length > 0 ? historico : [{ role: "user", content: pergunta }],
    temperature: 0.7
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  const resposta = data?.choices?.[0]?.message?.content || "❌ Erro ao gerar resposta com IA.";

  if (chatId) adicionarAoHistorico(chatId, { role: "assistant", content: resposta });

  return resposta;
}
