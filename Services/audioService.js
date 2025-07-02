// controladores/mensagemControlador.js

import TelegramBot from "node-telegram-bot-api";
import { obterUsuario, salvarUsuario } from "../serviços/usuarioService.js";
import { verificarAssinaturaAtiva } from "../serviços/pagamentoService.js";
import { gerarImagem } from "../serviços/imagemService.js";
import { gerarVideo } from "../serviços/videoService.js";
import { transcreverAudio } from "../serviços/audioService.js";
import { responderComVoz } from "../serviços/vozService.js";
import { apresentarPlanos } from "./commandController.js";

const boasVindas = async (bot, msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name;

  const texto = `👋 Olá, ${nome}! Seja bem-vindo ao *Líder Digital*!

Sou um bot de inteligência artificial poderoso e posso te ajudar com:
✅ Responder perguntas
✅ Gerar *imagens realistas* (plano necessário)
✅ Criar *vídeos com IA* (plano premium)
✅ Converter áudio para texto
✅ Responder com voz

💡 Para começar, digite "plano" e conheça as opções.`;

  await bot.sendMessage(chatId, texto, { parse_mode: "Markdown" });
};

const tratarMensagem = async (bot, msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();
  const usuario = await obterUsuario(chatId);

  if (!usuario) await salvarUsuario(msg.from);

  // Mensagem de comando inicial
  if (texto === "/start") {
    return boasVindas(bot, msg);
  }

  // Mostrar planos se digitar "plano"
  if (texto?.includes("plano")) {
    return apresentarPlanos(bot, chatId);
  }

  // Verificar assinatura
  const assinaturaAtiva = await verificarAssinaturaAtiva(chatId);

  // Comando de imagem
  if (texto?.includes("imagem")) {
    if (!assinaturaAtiva)
      return bot.sendMessage(chatId, "🔒 Para gerar imagens, ative um plano: digite *plano*", { parse_mode: "Markdown" });

    return gerarImagem(bot, chatId, texto);
  }

  // Comando de vídeo
  if (texto?.includes("vídeo") || texto?.includes("video")) {
    if (!assinaturaAtiva || usuario.plano !== "premium")
      return bot.sendMessage(chatId, "🔒 Apenas clientes *premium* podem gerar vídeos. Digite *plano* para mais detalhes.", { parse_mode: "Markdown" });

    return gerarVideo(bot, chatId, texto);
  }

  // Responder normalmente com IA
  if (texto && texto.length > 2) {
    return bot.sendMessage(chatId, "🤖 Estou processando sua pergunta...");
  }
};

const tratarAudio = async (bot, msg) => {
  const chatId = msg.chat.id;
  const assinaturaAtiva = await verificarAssinaturaAtiva(chatId);

  if (!assinaturaAtiva) {
    return bot.sendMessage(chatId, "🔒 Para usar mensagens de voz, ative um plano: digite *plano*", { parse_mode: "Markdown" });
  }

  await transcreverAudio(bot, msg);
};

const tratarTextoComVoz = async (bot, chatId, texto) => {
  await responderComVoz(bot, chatId, texto);
};

export { tratarMensagem, tratarAudio, tratarTextoComVoz };
