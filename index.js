import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// Webhook para produção (Vercel)
const URL = `https://lider-digital-bot.vercel.app`;
bot.setWebHook(`${URL}/webhook/${process.env.BOT_TOKEN}`);

// Menu de comandos do bot
bot.setMyCommands([
  { command: "/convidar", description: "📨 Seu link de convite" },
  { command: "/saldo", description: "💰 Ver seu saldo de convites" },
  { command: "/saque", description: "📤 Solicitar saque por Pix" },
  { command: "/pixminhachave", description: "🔑 Atualizar chave Pix" },
  { command: "/assinantes", description: "👥 Total de assinantes (admin)" },
  { command: "/indicacoes", description: "📋 Quem convidou quem (admin)" },
  { command: "/pagamentos", description: "💸 Saques pendentes (admin)" },
  { command: "/usuarios", description: "📊 Lista de usuários (admin)" }
]);

export { bot };
