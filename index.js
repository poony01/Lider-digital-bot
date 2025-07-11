// index.js
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
export { bot };

const OWNER_ID = 6827676422; // ID do dono

// Função assíncrona para registrar os comandos
async function configurarComandos() {
  // Comandos públicos para todos
  await bot.setMyCommands([
    { command: "/start", description: "🚀 Iniciar o bot" },
    { command: "/limpar", description: "🧹 Limpar memória da IA" },
    { command: "/convidar", description: "📢 Convidar amigos e ganhar dinheiro" },
    { command: "/saldo", description: "💰 Ver seu saldo de comissões" },
    { command: "/saque", description: "🏦 Solicitar saque por Pix" }
  ]);

  // Comandos privados para o dono do bot
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

// Executa a configuração ao iniciar
configurarComandos().catch(console.error);
