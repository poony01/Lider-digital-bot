// controllers/messageController.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUserById, updateUserAccess } from '../services/userService.js';
import { processIACommand } from '../services/iaService.js';
import { verificarPagamento, gerarQRCodePix } from '../services/pagamentoService.js';
import { getAudioTranscription, responderComVoz } from '../services/audioService.js';
import { enviarMensagem } from '../helpers/messageHelper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from?.first_name || 'usuário';
  const mensagem = msg.text?.toLowerCase() || '';

  const user = await getUserById(chatId);
  const agora = new Date();

  if (!user) {
    await bot.sendMessage(chatId, `Olá ${nome}! 👋\nSeja bem-vindo ao *Líder Digital*!\n\n💬 Sou um chat poderoso e posso te ajudar com: criação de imagens, vídeos, resposta por voz, e muito mais.\n\nDigite *plano* para conhecer os planos disponíveis.`, { parse_mode: 'Markdown' });
    return;
  }

  if (mensagem === 'plano' || mensagem === 'assinatura') {
    const qrCode = await gerarQRCodePix(chatId, 1890); // valor inicial padrão R$18,90
    await bot.sendPhoto(chatId, qrCode.imagemQRCODE, {
      caption: `💳 Escolha seu plano:

🥉 *Plano Básico* - R$18,90
Acesso a comandos de imagem e vídeos básicos.

🥇 *Plano Premium* - R$22,90
Funções avançadas + acesso exclusivo a vídeos IA, voz e imagens realistas.

⚠️ *Após o pagamento*, o acesso será liberado automaticamente.

🔁 Envie o comprovante ou aguarde a confirmação.`,
      parse_mode: 'Markdown'
    });
    await bot.sendMessage(chatId, `📎 Chave Pix: \`${process.env.PIX_CHAVE}\`
📤 Copie e cole no seu app para pagar.`, { parse_mode: 'Markdown' });
    return;
  }

  if (user.expiraEm && new Date(user.expiraEm) < agora) {
    await updateUserAccess(chatId, false);
    return bot.sendMessage(chatId, `⏳ Sua assinatura expirou. Digite *plano* para renovar.`);
  }

  if (!user.ativo && mensagem !== 'plano' && mensagem !== 'assinatura') {
    return bot.sendMessage(chatId, `🔒 Para usar, ative um plano enviando: *plano*`);
  }

  if (mensagem.startsWith('criar imagem') || mensagem.includes('imagem')) {
    return processIACommand(bot, msg, 'imagem');
  }

  if (mensagem.includes('vídeo') || mensagem.startsWith('fazer vídeo')) {
    return processIACommand(bot, msg, 'video');
  }

  // Comandos normais - interação IA
  return processIACommand(bot, msg, 'texto');
}
