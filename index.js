// index.js
import TelegramBot from "node-telegram-bot-api";
import { handleCallbackQuery } from "./controllers/callbackController.js";

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// 🔹 Trata cliques em botões inline
bot.on("callback_query", async (query) => {
  try {
    await handleCallbackQuery(bot, query);
  } catch (error) {
    console.error("Erro ao tratar callback_query:", error);
  }
});
