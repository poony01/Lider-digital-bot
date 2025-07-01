import { getUserById, createUser, isAssinanteAtivo } from '../services/userService.js';
import { handleCommand } from './commandController.js';
import { enviarMensagemBoasVindas } from '../helpers/welcome.js';
import { verificarPagamento, gerarQRCodePix } from '../services/pagamentoService.js';
import { gerarImagem } from '../services/imageService.js';
import { gerarVideo } from '../services/videoService.js';
import { transcreverAudio } from '../services/audioService.js';
import { responderComVoz } from '../services/voiceService.js';

export async function handleMessage(msg, bot) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const nome = msg.from.first_name;

  let user = await getUserById(userId);
  if (!user) {
    await createUser(userId, nome);
    await enviarMensagemBoasVindas(bot, chatId, nome);
    return;
  }

  // Verifica se há pagamento pendente
  if (msg.text?.toLowerCase() === 'assinar' || msg.text?.toLowerCase() === 'assinatura') {
    const qrCode = await gerarQRCodePix(userId);
    bot.sendPhoto(chatId, qrCode.imagem, {
      caption: `🔐 Escolha um plano para liberar todos os comandos:

✅ Plano Básico: R$ 18,90
Acesso a imagens e vídeos simples

💎 Plano Premium: R$ 22,90
Imagens realistas, vídeos profissionais, voz e mais

📲 Copie e cole o código abaixo no app do seu banco para pagar via Pix:\n\n${qrCode.copiaecola}`,
    });
    return;
  }

  // Comando especial do painel admin
  if (userId.toString() === process.env.DONO_ID) {
    if (['painel', 'bloquear', 'desbloquear', 'convidados', 'saques'].some(cmd => msg.text?.toLowerCase().startsWith(cmd))) {
      const { handleAdmin } = await import('./adminController.js');
      await handleAdmin(msg, bot);
      return;
    }
  }

  // Verifica se o usuário é assinante ativo
  const ativo = await isAssinanteAtivo(userId);
  if (!ativo) {
    bot.sendMessage(chatId, `🔒 Para usar este recurso, você precisa assinar um plano.\n\nDigite: *assinatura*`, { parse_mode: 'Markdown' });
    return;
  }

  // Comandos de criação de imagem
  if (msg.text?.toLowerCase().includes('imagem')) {
    const resultado = await gerarImagem(msg.text);
    return bot.sendPhoto(chatId, resultado.url, { caption: '🖼️ Imagem gerada com sucesso!' });
  }

  // Comandos de criação de vídeo
  if (msg.text?.toLowerCase().includes('vídeo') || msg.text?.toLowerCase().includes('video')) {
    const resultado = await gerarVideo(msg.text);
    return bot.sendVideo(chatId, resultado.url, { caption: '🎥 Vídeo gerado com sucesso!' });
  }

  // Responder texto normal com IA
  if (msg.text) {
    const resposta = await handleCommand(msg.text);
    return bot.sendMessage(chatId, resposta);
  }

  // Áudio de voz
  if (msg.voice) {
    const respostaTexto = await transcreverAudio(bot, msg);
    const respostaVoz = await responderComVoz(respostaTexto);
    await bot.sendVoice(chatId, respostaVoz);
  }
}
