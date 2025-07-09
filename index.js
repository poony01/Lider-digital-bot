// index.js
import TelegramBot from "node-telegram-bot-api";
import webhook from "./webhook.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
export { bot };

const OWNER_ID = Number(process.env.OWNER_ID);

// Define comandos apenas uma vez na inicialização
const comandosPadrao = [
  { command: "start", description: "Iniciar o bot" },
  { command: "limpar", description: "Limpar memória da IA" },
  { command: "convidar", description: "Convidar amigos e ganhar dinheiro" },
  { command: "saldo", description: "Ver seu saldo de comissões" },
  { command: "saque", description: "Solicitar saque por Pix" },
  { command: "usuarios", description: "Total de usuários" },
  { command: "assinantes", description: "Planos ativos" },
  { command: "indicações", description: "Ver afiliados por ID" },
  { command: "zerarsaldo", description: "Zerar saldo manualmente" }
];

// Registra comandos apenas uma vez no início
bot.setMyCommands(comandosPadrao).catch(console.error);

// ✅ Exporta para serverless (Vercel, etc.)
export default webhook;
