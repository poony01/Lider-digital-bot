import TelegramBot from 'node-telegram-bot-api';

// Exporta o bot para ser usado no webhook
export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
