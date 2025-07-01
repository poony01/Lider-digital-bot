import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import bot from "./controllers/commandController.js";
import "./controllers/messageController.js";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKEN = process.env.BOT_TOKEN;
const botInstance = new TelegramBot(TOKEN, { polling: false });

// Rota principal só para teste
app.get("/", (req, res) => {
  res.send("🤖 Bot está rodando com sucesso!");
});

// ✅ Rota do Webhook
app.post(`/webhook/${TOKEN}`, express.json(), (req, res) => {
  botInstance.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
