// index.js
import express from 'express';
import { webhookCallback } from 'telegraf';
import bot from './bot/bot.js'; // Altere o caminho se necessário
import 'dotenv/config';

const app = express();

// Rota do webhook (Telegram irá chamar esta URL com atualizações)
app.use(
  `/webhook/${process.env.BOT_TOKEN}`,
  express.json(),
  webhookCallback(bot)
);

// Porta local para testes (opcional na Vercel)
app.listen(3000, () => {
  console.log('🚀 Bot rodando com webhook');
});

export default app;
