// index.js
import TelegramBot from "node-telegram-bot-api";
import { configurarComandos } from "./controllers/commandController.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// Define o webhook do Telegram apontando para sua URL da Vercel
const URL = `https://lider-digital-bot.vercel.app`; // Altere se necessário
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

// ID da administradora (vindo da variável de ambiente)
const DONO_ID = process.env.DONO_ID || "1451510843";

// Busca o nome de usuário do bot para os links personalizados
bot.getMe().then(info => {
  bot.username = info.username; // Define o nome do bot como @Liderdigitalbot
  configurarComandos(bot, DONO_ID); // Só configura os comandos depois que o nome estiver pronto
  console.log(`🤖 Bot iniciado como @${bot.username}`);
});

export { bot };
