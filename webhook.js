// webhook.js
import { bot } from "./index.js";
import { askGPT } from "./services/iaService.js";
import { gerarImagem } from "./services/imageService.js";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;
  const msg = update?.message;

  if (!msg || !msg.text) return res.status(200).send("Sem mensagem");

  const chatId = msg.chat.id;
  const texto = msg.text.trim();

  try {
    if (texto.toLowerCase().startsWith("img ")) {
      const prompt = texto.slice(4).trim();

      if (prompt.length < 5) {
        await bot.sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um astronauta surfando em Marte");
        return res.status(200).send("Prompt muito curto");
      }

      const url = await gerarImagem(prompt);
      if (url) {
        await bot.sendPhoto(chatId, url); // 🔹 Só imagem, sem texto
      } else {
        await bot.sendMessage(chatId, "❌ Erro ao gerar imagem. Tente novamente.");
      }

    } else {
      await bot.sendChatAction(chatId, "typing");
      const resposta = await askGPT(texto);
      await bot.sendMessage(chatId, resposta);
    }

    res.status(200).send("OK");
  } catch (e) {
    console.error("Erro no webhook:", e);
    await bot.sendMessage(chatId, "❌ Erro interno. Tente novamente.");
    res.status(200).send("Erro tratado");
  }
};
