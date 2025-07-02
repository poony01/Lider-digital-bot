// Inicialização do bot Telegram para uso via importação (webhook)

import TelegramBot from "node-telegram-bot-api";

// BOT_TOKEN deve ser definido nas variáveis de ambiente (.env ou dashboard Vercel)
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
});

export default bot;
