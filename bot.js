// bot.js
import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
  webHook: {
    port: process.env.PORT || 3000
  }
});

// Define o webhook da Vercel (exemplo: https://seu-projeto.vercel.app/webhook)
const webhookURL = `https://${process.env.VERCEL_URL}/webhook`;
bot.setWebHook(webhookURL);
