// index.js
import TelegramBot from "node-telegram-bot-api";

// Cria o bot SEM polling (Vercel usa webhook)
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
export { bot };
