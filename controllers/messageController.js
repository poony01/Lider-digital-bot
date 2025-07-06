// controllers/messageController.js
import { responderIA } from '../services/iaService.js';
import { gerarImagem } from '../services/imageService.js';

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (!texto) return;

  // 🎉 Mensagem de boas-vindas
  if (texto === "/start") {
    return await bot.sendMessage(chatId, `
