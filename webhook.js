import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

const setWebhook = async () => {
  const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook`;
  const webhookUrl = `https://lider-digital-bot.vercel.app/webhook/${process.env.BOT_TOKEN}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl })
  });

  const result = await response.json();
  console.log(result);
};

setWebhook();
