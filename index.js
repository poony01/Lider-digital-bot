// index.js
import TelegramBot from "node-telegram-bot-api";
import { handleMessage } from "./controllers/messageController.js";
import { handleCallback } from "./controllers/callbackController.js";

export const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true, // ✅ Ativa o recebimento contínuo de mensagens
});

// 📩 Trata mensagens de texto
bot.on("message", async (msg) => {
  try {
    await handleMessage(bot, msg);
  } catch (error) {
    console.error("Erro ao tratar mensagem:", error);
  }
});

// 🔘 Trata cliques nos botões inline (como planos Pix)
bot.on("callback_query", async (query) => {
  try {
    await handleCallback(bot, query);
  } catch (error) {
    console.error("Erro ao tratar callback_query:", error);
  }
});
