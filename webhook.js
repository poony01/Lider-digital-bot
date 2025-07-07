import { bot } from './index.js';
import { handleMessage } from './controllers/messageController.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message) {
      await handleMessage(bot, update.message);
    }
  } catch (e) {
    console.error("Erro ao processar update:", e);
  }

  res.status(200).send("OK");
};
