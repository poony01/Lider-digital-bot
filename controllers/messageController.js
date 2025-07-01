// controllers/messageController.js
import { sendMessage } from '../services/telegramService.js';
import { handleCommand } from './commandController.js';
import { verificarAcesso } from '../utils/accessControl.js';

export async function processMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() || '';

  if (text === '/start' || text.includes('olá')) {
    return sendMessage(chatId, `👋 Olá ${msg.from.first_name}! Seja bem-vindo ao *Líder Digital* 🚀

Sou um chat poderoso e posso te ajudar com:

✅ Criação de imagens por IA  
✅ Geração de vídeos com inteligência  
✅ Respostas com voz e transcrição de áudio  
✅ Atendimento inteligente via IA  
✅ Sistema de convites e recompensas

🔒 Para ativar os recursos premium, envie: *assinatura*
`);
  }

  const temAcesso = await verificarAcesso(chatId);
  if (!temAcesso && !['assinatura', 'plano'].includes(text)) {
    return sendMessage(chatId, '🔒 Você precisa ativar um plano. Digite *plano* ou *assinatura* para começar.');
  }

  await handleCommand(chatId, text, msg);
}
