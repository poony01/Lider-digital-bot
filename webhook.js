import { handleMessage } from './controllers/messageController.js';
import { handleCommand } from './controllers/commandController.js';
import { handleAdmin } from './controllers/adminController.js';

export default async function webhook(req, res) {
  const body = req.body;

  // Telegram envia mensagem no formato 'message' ou 'edited_message'
  const message = body.message || body.edited_message;
  if (!message) {
    return res.status(200).send('Ignore non-message payload');
  }

  const text = message.text || '';
  const chatId = message.chat.id;
  const userId = message.from.id;

  // Admin commands (exemplo: /quantos usuários)
  if (text.startsWith('/') && await handleAdmin(text, chatId, userId)) {
    return res.status(200).send('Admin command handled');
  }

  // Commands
  if (text.startsWith('/')) {
    await handleCommand(text, chatId, userId);
    return res.status(200).send('Command handled');
  }

  // Normal user messages (ChatGPT, IA, etc)
  await handleMessage(message, chatId, userId);
  res.status(200).send('Message handled');
}
