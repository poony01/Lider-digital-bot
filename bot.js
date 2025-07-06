// bot.js
import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.BOT_TOKEN, { webHook: { port: false } });

// Define o webhook do Telegram com a URL pública da Vercel
const url = `https://${process.env.VERCEL_URL}`;
bot.setWebHook(`${url}/webhook`);
