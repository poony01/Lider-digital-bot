import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// Define o webhook do Telegram apontando para sua URL da Vercel
const URL = `https://lider-digital-bot.vercel.app`; // altere se seu domínio for outro
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

export { bot };
