// controllers/commandController.js
import { sendMessage } from '../services/telegramService.js';
import { gerarImagem } from '../services/imageService.js';
import { gerarVideo } from '../services/videoService.js';
import { gerarTextoIA } from '../services/iaService.js';
import { exibirPlanos } from '../services/pagamentoService.js';

export async function handleCommand(chatId, text, msg) {
  if (text.includes('imagem')) {
    const prompt = text.replace('imagem', '').trim();
    if (!prompt) return sendMessage(chatId, '🖼️ Envie algo como: *criar imagem do mar*');
    return await gerarImagem(chatId, prompt);
  }

  if (text.includes('vídeo') || text.includes('video')) {
    const prompt = text.replace(/(vídeo|video)/, '').trim();
    if (!prompt) return sendMessage(chatId, '🎬 Envie algo como: *fazer vídeo sobre marketing*');
    return await gerarVideo(chatId, prompt);
  }

  if (text === 'plano' || text === 'assinatura') {
    return await exibirPlanos(chatId);
  }

  if (msg.voice) {
    return sendMessage(chatId, '🔈 Recebi seu áudio. (Função de transcrição será ativada em breve!)');
  }

  // Comando padrão: responder com IA
  return await gerarTextoIA(chatId, text);
}
