// services/iaService.js
import fetch from "node-fetch";
import { getMemory, saveMemory } from "../services/memoryService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(pergunta, userId, modelo = "gpt-4") {
  const historico = await getMemory(userId);

  // Adiciona a nova pergunta ao histórico
  historico.push({ role: "user", content: pergunta });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelo,
      messages: historico,
      temperature: 0.7,
    }),
  });

  const json = await response.json();

  if (!json.choices || !json.choices[0]) {
    throw new Error("❌ Erro ao obter resposta da IA");
  }

  const resposta = json.choices[0].message.content;

  // Salva a resposta no histórico
  historico.push({ role: "assistant", content: resposta });
  await saveMemory(userId, historico);

  return resposta;
}
