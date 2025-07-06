import TelegramBot from "node-telegram-bot-api";

export const bot = new TelegramBot(process.env.BOT_TOKEN, {
  webHook: {
    port: false
  }
});

// Ativa webhook com URL da Vercel
const webhookUrl = `https://${process.env.VERCEL_URL}/webhook`;
bot.setWebHook(webhookUrl);
