// webhook.js
import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
config();

import { tratarCallbackQuery } from "./controllers/callbackController.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  webHook: { port: 3000 },
});

bot.setWebHook(`${process.env.VERCEL_URL}/api`);

bot.on("callback_query", async (query) => {
  await tratarCallbackQuery(bot, query);
});
