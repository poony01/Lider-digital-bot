import express from "express";
import { webhookCallback } from "grammy";
import bot from "./webhook.js";

const app = express();

app.use(express.json());
app.use(`/${bot.token}`, webhookCallback(bot, "express"));

app.get("/", (req, res) => {
  res.send("Bot está online!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
