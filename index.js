// index.js
import TelegramBot from "node-telegram-bot-api";

// Vercel já carrega as variáveis de ambiente automaticamente
export const bot = new TelegramBot(process.env.BOT_TOKEN);
