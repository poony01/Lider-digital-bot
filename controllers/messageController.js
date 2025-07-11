import { responderIA } from "../services/iaService.js";
import { gerarImagemProfissional } from "../services/imageService.js";
import { obterAfiliado } from "../services/afiliadoService.js";
import { obterUsuario, registrarUsuario, incrementarMensagens } from "../services/userService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;
  const nome = msg.from?.first_name || "usuário";

  if (!texto) return;

  // Geração de imagem com comando: img ...
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.slice(4).trim();
    if (!prompt) {
      return await bot.sendMessage(chatId, "❗ Envie uma descrição para gerar a imagem. Exemplo:\nimg um leão com óculos, estilo realista");
    }

    // Verifica assinatura
    const dados = await obterAfiliado(chatId);
    if (!dados?.plano && dados?.mensagens_usadas >= 5) {
      return await bot.sendMessage(chatId, "🔒 Você atingiu o limite gratuito. Assine um plano para continuar.");
    }

    await bot.sendChatAction(chatId, "upload_photo");
    const url = await gerarImagemProfissional(prompt);
    if (url) {
      if (!dados?.plano) await incrementarMensagens(chatId);
      return await bot.sendPhoto(chatId, url, {
        caption: "🖼️ Imagem profissional gerada com IA! Peça outra se quiser 😄"
      });
    } else {
      return await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente.");
    }
  }

  // Geração de texto com IA
  await bot.sendChatAction(chatId, "typing");

  // Registra o usuário se for a primeira vez
  const usuario = await obterUsuario(chatId);
  if (!usuario) {
    await registrarUsuario(chatId, nome);
  }

  const dados = await obterAfiliado(chatId);

  // Verifica se já usou 5 mensagens grátis
  if (!dados?.plano && dados?.mensagens_usadas >= 5) {
    return await bot.sendMessage(chatId, "😔 Você atingiu o limite de 5 mensagens gratuitas. Assine um plano para desbloquear acesso completo.");
  }

  // Define modelo conforme plano
  const modelo = dados?.plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";
  const resposta = await responderIA(texto, modelo, chatId);

  if (!dados?.plano) await incrementarMensagens(chatId);

  return await bot.sendMessage(chatId, `🤖 ${resposta}`, { parse_mode: "Markdown" });
}
