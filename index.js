// index.js
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const OWNER_ID = Number(process.env.OWNER_ID); // Certifique-se de definir corretamente na Vercel

export { bot };

// Comandos públicos visíveis para todos os usuários
await bot.setMyCommands([
  { command: "/start", description: "🚀 Iniciar o bot" },
  { command: "/limpar", description: "🧹 Limpar memória da IA" },
  { command: "/convidar", description: "📢 Convidar amigos e ganhar dinheiro" },
  { command: "/saldo", description: "💰 Ver seu saldo de comissões" },
  { command: "/saque", description: "🏦 Solicitar saque por Pix" }
]);

// Comandos privados visíveis apenas para o dono (dono tem ID definido em OWNER_ID)
if (OWNER_ID) {
  await bot.setMyCommands([
    { command: "/usuarios", description: "👥 Total de usuários" },
    { command: "/assinantes", description: "✨ Planos ativos" },
    { command: "/indicacoes", description: "📊 Ver afiliados por ID" },
    { command: "/zerarsaldo", description: "❌ Zerar saldo manualmente" },
    { command: "/enviar", description: "✉️ Enviar mensagem para ID" },
    { command: "/broadcast", description: "📨 Enviar mensagem para todos" }
  ], {
    scope: {
      type: "chat",
      chat_id: OWNER_ID
    }
  });
}
