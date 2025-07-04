// services/iaService.js
import fetch from "node-fetch";
import { obterHistorico, adicionarAoHistorico } from "./memoryService.js";

export async function responderIA(pergunta, modelo = "gpt-3.5-turbo", chatId) {
  try {
    const historico = obterHistorico(chatId);

    // Adiciona a nova pergunta ao histórico temporário
    const mensagens = [...historico, { role: "user", content: pergunta }];

    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: mensagens,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const dados = await resposta.json();
    const conteudo = dados.choices?.[0]?.message?.content?.trim();

    if (conteudo) {
      // Salva pergunta e resposta na memória
      adicionarAoHistorico(chatId, "user", pergunta);
      adicionarAoHistorico(chatId, "assistant", conteudo);
      return conteudo;
    } else {
      return "❌ Não consegui entender sua pergunta.";
    }
  } catch (erro) {
    console.error("Erro ao acessar a OpenAI:", erro);
    return "❌ Ocorreu um erro ao tentar responder com IA.";
  }
}
