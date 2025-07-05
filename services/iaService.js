// iaService.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const historicos = {};

export function obterHistorico(chatId) {
  if (!historicos[chatId]) historicos[chatId] = [];
  return historicos[chatId];
}

export function adicionarAoHistorico(chatId, msg) {
  historicos[chatId].push(msg);
  if (historicos[chatId].length > 10) historicos[chatId].shift();
}

export async function responderIA(pergunta, modelo = "gpt-3.5-turbo", chatId) {
  try {
    const historico = obterHistorico(chatId);
    const mensagens = [...historico, { role: "user", content: pergunta }];

    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelo,
        messages: mensagens,
      }),
    });

    const dados = await resposta.json();
    const msg = dados.choices?.[0]?.message?.content || "❌ Erro na IA.";

    adicionarAoHistorico(chatId, { role: "user", content: pergunta });
    adicionarAoHistorico(chatId, { role: "assistant", content: msg });

    return msg;
  } catch (e) {
    console.error("Erro IA:", e);
    return "❌ Ocorreu um erro com a IA.";
  }
}
