import fetch from "node-fetch";
import { getMemory, saveMemory } from "./memoryService.js";
import { pesquisarNoGoogle } from "./googleService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(pergunta, userId) {
  const modelo = "gpt-4-turbo";
  const historico = await getMemory(userId);
  historico.push({ role: "user", content: pergunta });

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const mensagens = [
    {
      role: "system",
      content: `Você é uma assistente inteligente, educada e simpática. Hoje é ${dataAtual}. Sempre responda com clareza e use emojis variados como 🤖✨🎉😉🧠 para tornar a conversa mais divertida.`
    },
    ...historico
  ];

  const body = {
    model: modelo,
    messages: mensagens,
    temperature: 0.7
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
  let resposta = data.choices?.[0]?.message?.content?.trim() || "🤖 Sem resposta da IA.";

  // 🧠 Verifica se o modelo sugeriu fazer uma pesquisa
  if (/pesquisar no google|ver na internet|precisa procurar|não sei/gim.test(resposta)) {
    const resultadoGoogle = await pesquisarNoGoogle(pergunta);
    resposta += `\n\n🌐 Resultado encontrado no Google:\n${resultadoGoogle}`;
  }

  historico.push({ role: "assistant", content: resposta });
  await saveMemory(userId, historico);

  return resposta;
}
