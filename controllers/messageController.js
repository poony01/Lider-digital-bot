import fs from 'fs';
import path from 'path';
import { responderIA } from '../services/iaService.js';
import { criarImagem } from '../services/imagemService.js';
import { criarVideo } from '../services/videoService.js';
import { transcreverAudio } from '../services/audioService.js';
import { sintetizarResposta } from '../services/voiceService.js';
import { verificarAssinatura } from '../services/pagamentoService.js';
import { handleAdmin } from './adminController.js';
import { mostrarPlanos } from './commandController.js';
import { salvarUsuario } from '../services/userService.js';
import { formatarData } from '../helpers/formatDate.js';

const assinantesPath = path.resolve('data/assinantes.json');
const usersPath = path.resolve('data/users.json');

export async function handleMessage(msg, bot) {
  const chatId = msg.chat.id;
  const userId = String(chatId);
  const nome = msg.chat.first_name;

  salvarUsuario(userId, nome);

  // Detectar comandos administrativos
  if (userId === process.env.DONO_ID) {
    await handleAdmin(msg, bot);
  }

  const assinantes = JSON.parse(fs.readFileSync(assinantesPath));
  const user = assinantes[userId];
  const dataAtual = new Date();
  let planoAtivo = false;

  if (user) {
    const dataFim = new Date(user.fim);
    if (dataAtual <= dataFim) planoAtivo = true;
  }

  const texto = msg.text?.toLowerCase();

  if (texto === '/start') {
    return bot.sendMessage(chatId,
      `👋 Olá ${nome}, seja bem-vindo ao *Líder Digital*! \n\n🤖 Sou um bot poderoso com inteligência artificial. Posso:\n\n✅ Responder perguntas\n✅ Receber e responder áudios\n🔍 Gerar imagens por IA\n🎬 Criar vídeos realistas\n\nPara começar, digite *plano* e escolha uma opção.\n\nSe já possui uma assinatura, você pode usar os comandos direto como:\n➡️ criar imagem do mar\n➡️ fazer vídeo sobre vendas`,
      { parse_mode: 'Markdown' }
    );
  }

  if (texto === 'plano' || texto === 'assinatura') {
    return mostrarPlanos(bot, chatId);
  }

  // Se não assinante
  if (!planoAtivo) {
    return bot.sendMessage(chatId,
      `👋 Olá ${nome}!\n\n🔒 Para acessar imagens, vídeos e voz com IA, ative um plano:\n\nDigite: *plano* ou *assinatura*`,
      { parse_mode: 'Markdown' }
    );
  }

  // Plano ativo: processar comandos de IA
  if (texto?.includes('imagem')) {
    return criarImagem(bot, chatId, texto);
  }

  if (texto?.includes('vídeo') || texto?.includes('video')) {
    return criarVideo(bot, chatId, texto);
  }

  if (msg.voice) {
    const fileId = msg.voice.file_id;
    const respostaTexto = await transcreverAudio(fileId, bot);
    const respostaIA = await responderIA(respostaTexto);
    await bot.sendMessage(chatId, `🗣️ ${respostaIA}`);
    return sintetizarResposta(respostaIA, bot, chatId);
  }

  // Texto comum
  if (texto && texto.length > 1) {
    const resposta = await responderIA(texto);
    return bot.sendMessage(chatId, resposta);
  }
}
