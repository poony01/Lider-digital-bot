import TelegramBot from "node-telegram-bot-api";

// Instância do bot Telegram. O token deve estar configurado nas variáveis de ambiente da Vercel.
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

export { bot };
