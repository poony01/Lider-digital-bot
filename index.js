import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import bot from "./controladores/commandController.js";
import "./controladores/messageController.js";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKEN = process.env.BOT_TOKEN;
const botInstance = new TelegramBot(TOKEN, { polling: false });

// Rota de teste
app.get("/", (req, res) => {
  res.send("🤖 Bot está rodando com sucesso!");
});

// Webhook
app.post(`/webhook/${TOKEN}`, express.json(), (req, res) => {
  botInstance.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORTA || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
