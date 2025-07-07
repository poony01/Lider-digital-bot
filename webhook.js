import { bot } from './index.js';
import { gerarImagem } from './services/imageService.js';
import { responderIA } from './services/iaService.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;
  const msg = update?.message;
  if (!msg) return res.status(200).send("Sem mensagem");

  const chatId = msg.chat.id;
  const texto = msg.text;
  if (!texto) return res.status(200).send("Sem texto");

  try {
    // 🔹 Geração de imagem com "img ..."
    if (texto.toLowerCase().startsWith("img ")) {
      const prompt = texto.replace("img ", "").trim();
      if (prompt.length < 5) {
        await sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um leão de terno em Nova York");
        return res.status(200).send("Prompt inválido");
      }

      const url = await gerarImagem(prompt);
      if (url) {
        await sendPhoto(chatId, url);
      } else {
        await sendMessage(chatId, "❌ Erro ao gerar imagem. Tente novamente.");
      }
      return res.status(200).send("Imagem tratada");
    }

    // 🔹 Mensagem comum com IA
    const resposta = await responderIA(texto);
    await sendMessage(chatId, resposta);
    return res.status(200).send("Resposta IA enviada");

  } catch (e) {
    console.error("Erro no webhook:", e);
    await sendMessage(chatId, "❌ Erro interno. Tente novamente.");
    return res.status(500).send("Erro interno");
  }
};

// 🔸 Envia mensagem de texto
async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

// 🔸 Envia imagem
async function sendPhoto(chatId, photoUrl) {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl })
  });
}
