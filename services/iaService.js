import fetch from "node-fetch";
import { getMemory, saveMemory } from "./memoryService.js";
import { pesquisarNoGoogle } from "./googleService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(pergunta, userId) {
  const modelo = "gpt-4-turbo";
  const historico = await getMemory(userId);

  // 🔎 Detecta se a pergunta é de busca no Google
  const precisaBuscarNoGoogle = /(youtube|vídeo|vídeos|últimas|notícias|como|quando|site|link|recomenda|dica|assistir|procurar)/i.test(pergunta);

  // Se for busca no Google, faz a busca e responde com resultado
  if (precisaBuscarNoGoogle) {
    const resultado = await pesquisarNoGoogle(pergunta);
    historico.push({ role: "user", content: pergunta });
    historico.push({ role: "assistant", content: resultado });
    await saveMemory(userId, historico);
    return resultado;
  }

  // 🧠 Continua com IA normalmente
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
  const resposta = data.choices?.[0]?.message?.content?.trim() || "🤖 Sem resposta da IA.";

  historico.push({ role: "assistant", content: resposta });
  await saveMemory(userId, historico);

  return resposta;
}
