// index.js
import TelegramBot from "node-telegram-bot-api";
import { handleCallback } from "./controllers/callbackController.js"; // ✅ Correto

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

bot.on("callback_query", async (query) => {
  try {
    await handleCallback(bot, query); // ✅ Usa o nome correto
  } catch (error) {
    console.error("Erro ao tratar callback_query:", error);
  }
});
