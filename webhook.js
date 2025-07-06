// webhook.js
import TelegramBot from "node-telegram-bot-api";
import { handleMessage } from "./controllers/messageController.js";

const bot = new TelegramBot(process.env.BOT_TOKEN);

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("Bot online ✅");

  const update = req.body;
  if (update?.message) {
    await handleMessage(bot, update.message);
  }

  res.status(200).send("OK");
};
