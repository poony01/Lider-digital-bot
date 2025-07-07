import { handleMessage } from './controllers/messageController.js';
import { handleCallback } from './controllers/callbackController.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallback(update.callback_query);
    }
  } catch (e) {
    console.error("Erro ao processar update:", e);
  }

  res.status(200).send("OK");
};
