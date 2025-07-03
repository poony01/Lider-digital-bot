import TelegramBot from "node-telegram-bot-api";

// Token vem das variáveis da Vercel
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

export { bot };
