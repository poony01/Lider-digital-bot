// index.js
import TelegramBot from "node-telegram-bot-api";
import { configurarComandos } from "./controllers/commandController.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const URL = `https://lider-digital-bot.vercel.app`; // Altere se necessário
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

const DONO_ID = process.env.DONO_ID || "1451510843";

// Aguarda o bot obter seu username antes de configurar os comandos
bot.getMe().then(info => {
  bot.username = info.username || "liderdigitalbot";
  configurarComandos(bot, DONO_ID);
  console.log(`🤖 Bot iniciado como @${bot.username}`);
});

export { bot };
