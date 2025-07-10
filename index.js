import TelegramBot from "node-telegram-bot-api";

// Cria o bot SEM polling (uso com webhook)
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
export { bot };

// 🟢 Comandos públicos (para todos)
const comandosPublicos = [
  { command: "/start", description: "🚀 Iniciar o bot" },
  { command: "/limpar", description: "🧹 Limpar memória da IA" },
  { command: "/convidar", description: "📢 Convidar amigos e ganhar dinheiro" },
  { command: "/saldo", description: "💰 Ver seu saldo de comissões" },
  { command: "/saque", description: "🏦 Solicitar saque por Pix" }
];

// 🔒 Comandos da dona (visíveis só pra você)
const comandosAdmin = [
  { command: "/usuarios", description: "👥 Total de usuários" },
  { command: "/assinantes", description: "✨ Planos ativos" },
  { command: "/indicacoes", description: "📊 Ver afiliados por ID" },
  { command: "/zerarsaldo", description: "❌ Zerar saldo manualmente" },
  { command: "/enviar", description: "✉️ Enviar mensagem para ID" },
  { command: "/broadcast", description: "📨 Enviar mensagem para todos" }
];

// 🔄 Define comandos públicos para todos (inclusive você)
await bot.setMyCommands(comandosPublicos);

// 🔐 Define comandos de admin apenas para a dona
await bot.setMyCommands(comandosAdmin, {
  scope: {
    type: "chat",
    chat_id: Number(process.env.OWNER_ID)
  }
});
