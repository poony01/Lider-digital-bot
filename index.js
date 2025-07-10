// index.js
import TelegramBot from "node-telegram-bot-api";

// Cria o bot SEM polling (para uso com webhook/Vercel)
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
export { bot };

// ✅ Comandos visíveis para todos (inclusive para o dono)
await bot.setMyCommands([
  { command: "/start", description: "🚀 Iniciar o bot" },
  { command: "/limpar", description: "🧹 Limpar memória da IA" },
  { command: "/convidar", description: "📢 Convidar amigos e ganhar dinheiro" },
  { command: "/saldo", description: "💰 Ver seu saldo de comissões" },
  { command: "/saque", description: "🏦 Solicitar saque por Pix" }
]);

// ✅ Comandos visíveis apenas para o dono do bot
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
    chat_id: 6827676422  // Novo ID do dono
  }
});
