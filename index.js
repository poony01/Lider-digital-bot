// 📁 index.js
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

// Controladores
import bot from "./controladores/controladorComandos.js";
import "./controladores/controladorMensagens.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKEN = process.env.BOT_TOKEN;
const botInstance = new TelegramBot(TOKEN, { polling: false });

// ✅ Rota principal de teste
app.get("/", (req, res) => {
  res.send("🤖 Bot está rodando com sucesso!");
});

// ✅ Rota do Webhook
app.post(`/webhook/${TOKEN}`, express.json(), (req, res) => {
  botInstance.processUpdate(req.body);
  res.sendStatus(200);
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
});
