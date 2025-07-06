import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const WEBHOOK_URL = `https://${process.env.VERCEL_URL}/webhook`;

bot.setWebHook(WEBHOOK_URL);
