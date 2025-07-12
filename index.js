// index.js
import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import { tratarMensagem } from "./controllers/messageController.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";

config(); // Carrega variáveis .env

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Responde mensagens normais (ex: texto, comandos)
bot.on("message", async (msg) => {
  try {
    await tratarMensagem(bot, msg);
  } catch (e) {
    console.error("❌ Erro ao tratar mensagem:", e.message);
  }
});

// Responde cliques em botões inline
bot.on("callback_query", async (callbackQuery) => {
  try {
    await tratarCallbackQuery(bot, callbackQuery);
  } catch (e) {
    console.error("❌ Erro no callback:", e.message);
  }
});
