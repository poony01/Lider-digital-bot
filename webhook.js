// webhook.js
import { bot } from './index.js';
import { gerarImagem } from './services/imageService.js';
import { askGPT } from './services/iaService.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;
  const msg = update?.message;
  if (!msg?.text) return res.status(200).send("Sem texto");

  const chatId = msg.chat.id;
  const texto = msg.text.trim();

  try {
    // Mostrar "digitando..."
    await bot.sendChatAction(chatId, "typing");

    // Geração de imagem com IA
    if (texto.toLowerCase().startsWith("img ")) {
      const prompt = texto.replace("img ", "").trim();

      if (prompt.length < 5) {
        await bot.sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um leão realista de óculos no deserto");
        return res.status(200).send("Prompt muito curto");
      }

      const url = await gerarImagem(prompt);
      if (url) {
        await bot.sendPhoto(chatId, url);
      } else {
        await bot.sendMessage(chatId, "❌ Erro ao gerar imagem. Tente novamente.");
      }

      return res.status(200).send("Imagem processada");
    }

    // Resposta normal de IA
    const resposta = await askGPT([{ role: "user", content: texto }]);
    await bot.sendMessage(chatId, resposta);
    return res.status(200).send("Resposta enviada");
  } catch (e) {
    console.error("Erro ao processar webhook:", e);
    await bot.sendMessage(chatId, "❌ Ocorreu um erro. Tente novamente.");
    return res.status(500).send("Erro interno");
  }
};
