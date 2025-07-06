// webhook.js
import { bot } from './bot.js';
import { handleMessage } from './controllers/messageController.js';
import { handleCallback } from './controllers/callbackController.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;

    // Trata mensagens comuns
    if (body.message) {
      await handleMessage(bot, body.message);
    }

    // Trata cliques em botões inline
    if (body.callback_query) {
      await handleCallback(bot, body.callback_query);
    }

    return res.status(200).send('OK');
  }

  // Método inválido
  return res.status(405).send('Method Not Allowed');
}
