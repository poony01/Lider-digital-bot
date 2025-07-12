// services/iaService.js
import fetch from "node-fetch";
import { getMemory, saveMemory } from "./memoryService.js";
import { pesquisarNoGoogle } from "./googleService.js";
import { obterAfiliado } from "./afiliadoService.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const comandosBloqueados = [
  "/start", "/convidar", "/saldo", "/saque", "/usuarios",
  "/assinantes", "/indicações", "/zerarsaldo", "/limpar"
];

function deveBuscarNoGoogle(texto) {
  return /(notícias|últimas|vídeos do youtube|assistir o quê|melhores sites|link do site|site oficial)/i.test(texto);
}

export async function askGPT(pergunta, userId) {
  if (comandosBloqueados.some(cmd => pergunta.toLowerCase().startsWith(cmd))) {
    return null;
  }

  const usuario = await obterAfiliado(userId);
  const plano = usuario?.plano || "gratuito";
  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";

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
  const timeout = setTimeout(() => controller.abort(), 12000);

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

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erro na IA:", JSON.stringify(data, null, 2));
      if (data?.error?.code === "insufficient_quota") {
        return "🚫 Sua chave da OpenAI está sem crédito ou com restrição. Verifique no [Painel da OpenAI](https://platform.openai.com/account/usage)";
      }
      return "😔 Desculpe, a IA está indisponível no momento.";
    }

    const resposta = data.choices?.[0]?.message?.content?.trim() || "🤖 Sem resposta.";
    historico.push({ role: "assistant", content: resposta });
    await saveMemory(userId, historico);

    return resposta;

  } catch (err) {
    clearTimeout(timeout);
    console.error("⏱️ Timeout ou erro na IA:", err.message);
    return "⏱️ A IA demorou para responder. Tente novamente.";
  }
}
