// webhook.js
import { bot } from './bot.js';
import { handleMessage } from './controllers/messageController.js';
import { handleCallback } from './controllers/callbackController.js';

export default async (req, res) => {
  if (req.method === "POST") {
    const update = req.body;

    if (update.message) {
      await handleMessage(bot, update.message);
    } else if (update.callback_query) {
      await handleCallback(bot, update.callback_query);
    }

    res.status(200).send("OK");
  } else {
    res.status(200).send("Bot está online 🚀");
  }
};
