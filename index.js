import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import { tratarMensagem } from "./controladores/mensagemControlador.js";

config();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.use(bodyParser.json());

bot.on("message", async (msg) => {
  try {
    await tratarMensagem(bot, msg);
  } catch (erro) {
    console.error("Erro ao tratar mensagem:", erro);
    bot.sendMessage(msg.chat.id, "❌ Ocorreu um erro ao processar sua mensagem.");
  }
});

app.get("/", (req, res) => {
  res.send("🤖 Bot do Telegram rodando com sucesso!");
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
});
