// index.js
import TelegramBot from 'node-telegram-bot-api';
import { handleMessage } from './controllers/messageController.js';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  await handleMessage(bot, msg);
});
