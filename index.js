import TelegramBot from "node-telegram-bot-api";
import { configurarComandos } from "./controllers/commandController.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// Define o webhook do Telegram apontando para sua URL da Vercel
const URL = `https://lider-digital-bot.vercel.app`; // altere se necessário
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

// ID da administradora
const DONO_ID = process.env.DONO_ID || "1451510843";

// Configura o menu de comandos (três traços)
configurarComandos(bot, DONO_ID);

export { bot };
