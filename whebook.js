import { handleMessage } from './controllers/messageController.js';
import { handleCommand } from './controllers/commandController.js';
import { handleAdmin } from './controllers/adminController.js';

// Vercel exige exportação padrão da função handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const body = req.body;
  const message = body.message || body.edited_message;
  if (!message) {
    return res.status(200).send('Ignore non-message payload');
  }

  const text = message.text || '';
  const chatId = message.chat.id;
  const userId = message.from.id;

  // Admin commands
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
