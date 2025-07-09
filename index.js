// index.js
import TelegramBot from "node-telegram-bot-api";
import webhook from "./webhook.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
export { bot };

// ID do dono (administrador) do bot
const OWNER_ID = Number(process.env.OWNER_ID);

// Comandos visíveis no menu do Telegram
bot.on("message", async (msg) => {
  const userId = msg.from.id;

  // Comandos para todos os usuários
  const comandosPadrao = [
    { command: "start", description: "Iniciar o bot" },
    { command: "limpar", description: "Limpar memória da IA" },
    { command: "convidar", description: "Convidar amigos e ganhar dinheiro" },
    { command: "saldo", description: "Ver seu saldo de comissões" },
    { command: "saque", description: "Solicitar saque por Pix" }
  ];

  // Se for o dono do bot, adiciona comandos extras
  if (userId === OWNER_ID) {
    comandosPadrao.push(
      { command: "usuarios", description: "Total de usuários" },
      { command: "assinantes", description: "Planos ativos" },
      { command: "indicações", description: "Ver afiliados por ID" },
      { command: "zerarsaldo", description: "Zerar saldo manualmente" }
    );
  }

  await bot.setMyCommands(comandosPadrao);
});

// ✅ Exporta webhook para uso no serverless (Vercel, etc.)
export default webhook;
