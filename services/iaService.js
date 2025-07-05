// services/iaService.js
import fetch from "node-fetch";
import { obterHistorico, adicionarAoHistorico } from "./memoryService.js";
import dotenv from "dotenv";
dotenv.config();

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
    const mensagem = dados.choices?.[0]?.message?.content?.trim() || "❌ Erro ao gerar resposta.";

    adicionarAoHistorico(chatId, { role: "user", content: pergunta });
    adicionarAoHistorico(chatId, { role: "assistant", content: mensagem });

    return mensagem;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "❌ Ocorreu um erro ao responder com a IA.";
  }
}
