// services/iaService.js
import fetch from "node-fetch";
import { getMemory, saveMemory } from "./memoryService.js";
import { pesquisarNoGoogle } from "./googleService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Comandos que a IA não responde
const comandosBloqueados = [
  "/start", "/convidar", "/saldo", "/saque", "/usuarios", "/assinantes", "/indicações", "/zerarsaldo", "/limpar"
];

// Detecta se a pergunta deve acionar o Google (ajustado)
function deveBuscarNoGoogle(texto) {
  return /(notícias|últimas|vídeos do youtube|assistir o quê|melhores sites|link do site|site oficial)/i.test(texto);
}

export async function askGPT(pergunta, userId) {
  if (comandosBloqueados.some(cmd => pergunta.startsWith(cmd))) return null;

  const modelo = "gpt-4-turbo";
  const historico = await getMemory(userId);

  if (deveBuscarNoGoogle(pergunta)) {
    const resultado = await pesquisarNoGoogle(pergunta);
    historico.push({ role: "user", content: pergunta });
    historico.push({ role: "assistant", content: resultado });
    await saveMemory(userId, historico);
    return resultado;
  }

  historico.push({ role: "user", content: pergunta });

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const mensagens = [
    {
      role: "system",
      content: `Você é uma assistente inteligente, educada e simpática. Hoje é ${dataAtual}. Use emojis como 🤖✨😉 sempre que possível.`
    },
    ...historico
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000); // Timeout de 12 segundos

  try {
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
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const erro = await response.text();
      console.error("❌ Erro IA:", erro);
      return "😔 Desculpe, a IA está indisponível no momento.";
    }

    const data = await response.json();
    const resposta = data.choices?.[0]?.message?.content?.trim() || "🤖 Sem resposta.";
    historico.push({ role: "assistant", content: resposta });
    await saveMemory(userId, historico);

    return resposta;

  } catch (err) {
    clearTimeout(timeout);
    console.error("⏱️ Timeout ou erro de conexão:", err.message);
    return "⏱️ A IA demorou para responder. Tente novamente em instantes.";
  }
}
