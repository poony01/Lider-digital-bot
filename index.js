// index.js
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
export { bot };

// Apenas comando /start no menu
await bot.setMyCommands([
  { command: "/start", description: "🚀 Iniciar o bot" }
]);
