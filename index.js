// index.js
import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";
import { tratarMensagem } from "./controladores/mensagemControlador.js";

config();

const app = express();
const PORTA = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;
const URL_BASE = `https://api.telegram.org/bot${TOKEN}`;

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("🤖 Bot do Líder Digital está online!");
});

app.post(`/webhook/${TOKEN}`, async (req, res) => {
  const mensagem = req.body.message;
  if (mensagem) {
    await tratarMensagem(mensagem);
  }
  res.sendStatus(200);
});

app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
});
