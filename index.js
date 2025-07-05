// index.js
import TelegramBot from "node-telegram-bot-api";
import { configurarComandos } from "./controllers/commandController.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const URL = `https://lider-digital-bot.vercel.app`;
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

const DONO_ID = Number(process.env.DONO_ID || "1451510843");

bot.getMe().then(info => {
  bot.username = info.username;
  configurarComandos(bot, DONO_ID);
  console.log(`✅ Bot iniciado como @${bot.username}`);
}).catch(err => {
  console.error("❌ Erro ao buscar info do bot:", err.message);
});

export { bot };
