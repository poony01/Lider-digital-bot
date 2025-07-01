import express from "express";
import { Telegraf } from "telegraf";
import { config } from "dotenv";
import commandController from "./controllers/commandController.js";
import messageController from "./controllers/messageController.js";
import adminController from "./controllers/adminController.js";
import { verificarPagamentosPendentes } from "./services/pagamentoService.js";
import { carregarUsuarios } from "./services/userService.js";

config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

await carregarUsuarios();

bot.start((ctx) => {
  commandController.start(ctx, bot);
});
bot.command("assinatura", (ctx) => {
  commandController.assinatura(ctx);
});
bot.on("voice", (ctx) => {
  messageController.handleVoice(ctx);
});
bot.on("text", (ctx) => {
  const userId = String(ctx.from.id);
  const message = ctx.message.text.toLowerCase();

  if (message.includes("admin") && userId === process.env.DONO_ID) {
    adminController.menu(ctx, bot);
  } else {
    messageController.handleText(ctx, bot);
  }
});

app.use(express.json());
app.get("/", (req, res) => res.send("Bot está online!"));
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
bot.launch();
setInterval(verificarPagamentosPendentes, 60000 * 5); // verifica a cada 5 min
console.log("🤖 Bot iniciado com sucesso!");
