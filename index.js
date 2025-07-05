// index.js
import TelegramBot from "node-telegram-bot-api";
import { configurarComandos } from "./controllers/commandController.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// Define o webhook do Telegram apontando para sua URL da Vercel
const URL = `https://lider-digital-bot.vercel.app`; // Altere se necessário
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

// ID da administradora
const DONO_ID = process.env.DONO_ID || "1451510843";

// Aguarda o bot iniciar e obter o username antes de configurar os comandos
bot.getMe().then(info => {
  bot.username = info.username; // Armazena o username para o comando /convidar
  configurarComandos(bot, DONO_ID); // Agora podemos configurar os comandos
  console.log("🤖 Bot iniciado com sucesso:", bot.username);
}).catch(err => {
  console.error("❌ Erro ao iniciar bot:", err.message);
});

export { bot };
