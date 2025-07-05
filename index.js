// index.js
import TelegramBot from "node-telegram-bot-api";
import { configurarComandos } from "./controllers/commandController.js";

// Cria o bot com polling desativado (usamos webhook)
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// Define o webhook do Telegram apontando para sua URL da Vercel
const URL = `https://lider-digital-bot.vercel.app`; // Altere se necessário
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

// ID da administradora (vindo da variável de ambiente)
const DONO_ID = Number(process.env.DONO_ID || "1451510843");

// Obtém o nome do bot para usar nos links de convite
bot.getMe().then(info => {
  bot.username = info.username; // Ex: 'LiderDigitalBot'
  configurarComandos(bot, DONO_ID);
  console.log(`🤖 Bot iniciado como @${bot.username}`);
}).catch(error => {
  console.error("❌ Erro ao obter nome do bot:", error);
});

export { bot };
