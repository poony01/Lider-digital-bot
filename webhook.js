// webhook.js
import { gerarImagem } from './services/imageService.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("Bot online ✅");

  const update = req.body;

  if (!update?.message) return res.status(200).send("Sem mensagem");

  const chatId = update.message.chat.id;
  const texto = update.message.text;

  // 🖼️ Comando para gerar imagem
  if (texto?.toLowerCase().startsWith("img ")) {
    const prompt = texto.replace("img ", "").trim();

    if (prompt.length < 5) {
      await sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg uma cidade futurista com céu roxo");
      return res.status(200).send("Prompt curto");
    }

    try {
      const url = await gerarImagem(prompt);
      if (url) {
        await sendPhoto(chatId, url);
      } else {
        await sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente.");
      }
    } catch (e) {
      console.error("Erro ao gerar imagem:", e);
      await sendMessage(chatId, "❌ Erro ao gerar imagem. Tente novamente.");
    }

    return res.status(200).send("Imagem tratada");
  }

  // 💬 IA responde mensagens normais
  try {
    const resposta = await gerarRespostaIA(texto);
    await sendMessage(chatId, resposta);
  } catch (e) {
    console.error("Erro IA:", e);
    await sendMessage(chatId, "❌ Erro ao responder. Tente novamente.");
  }

  res.status(200).send("Mensagem tratada");
};

// 🔹 Auxiliares
async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

async function sendPhoto(chatId, photoUrl) {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl })
  });
}

// 🔹 IA de texto com OpenAI
import { Configuration, OpenAIApi } from "openai";
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

async function gerarRespostaIA(texto) {
  const resposta = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: texto }]
  });
  return resposta.data.choices[0].message.content;
}
