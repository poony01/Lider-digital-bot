import { bot } from './index.js';
import { askGPT } from './services/iaService.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text } = update.message;

      // Exibe "digitando..." antes de responder
      await bot.sendChatAction(chat.id, "typing");

      // Resposta da IA
      const reply = await askGPT(text);
      await bot.sendMessage(chat.id, reply);
    }
    // Se quiser tratar callback_query, adicione aqui
  } catch (e) {
    console.error("Erro ao processar update:", e);
  }

  res.status(200).send("OK");
};
