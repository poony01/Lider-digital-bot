// controllers/messageController.js
import { askGPT } from "../services/iaService.js";
import { gerarImagemProfissional } from "../services/imageService.js";
import { gerarVideoRunway } from "../services/runwayService.js";
import { obterAfiliado, registrarMensagem } from "../services/afiliadoService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;
  if (!texto) return;

  const usuario = await obterAfiliado(chatId);
  const plano = usuario?.plano || "gratuito";
  const totalMensagens = usuario?.mensagens || 0;

  const temLimite = plano === "gratuito" && totalMensagens >= 5;
  if (temLimite) {
    return await bot.sendMessage(chatId, "🚫 Você atingiu o limite gratuito de *5 mensagens*. Escolha um plano para continuar.", {
      parse_mode: "Markdown",
    });
  }

  // Geração de imagem com IA (img texto)
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.slice(4).trim();
    if (!prompt) {
      return await bot.sendMessage(chatId, "❗ Envie uma descrição após 'img'. Exemplo:\nimg um robô em um escritório");
    }

    await bot.sendChatAction(chatId, "upload_photo");
    const url = await gerarImagemProfissional(prompt);
    if (url) {
      await registrarMensagem(chatId);
      return await bot.sendPhoto(chatId, url, {
        caption: "🖼️ Imagem gerada com IA!",
      });
    } else {
      return await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem.");
    }
  }

  // Geração de vídeo com Runway (video texto ou video imagem)
  if (texto.toLowerCase().startsWith("video ")) {
    if (plano !== "premium") {
      return await bot.sendMessage(chatId, "🎬 Esta função está disponível apenas para assinantes do *Plano Premium* (R$34,90).", {
        parse_mode: "Markdown"
      });
    }

    const prompt = texto.slice(6).trim();
    if (!prompt) {
      return await bot.sendMessage(chatId, "❗ Envie uma descrição após 'video'. Exemplo:\nvideo um boi Nelore em uma fazenda por 20 segundos");
    }

    await bot.sendMessage(chatId, "🎥 Gerando seu vídeo com IA. Isso pode levar alguns segundos...");
    const videoUrl = await gerarVideoRunway(prompt);
    if (videoUrl) {
      await registrarMensagem(chatId);
      return await bot.sendVideo(chatId, videoUrl, {
        caption: "✅ Vídeo gerado com sucesso!"
      });
    } else {
      return await bot.sendMessage(chatId, "❌ Não consegui gerar o vídeo. Tente novamente mais tarde.");
    }
  }

  // Resposta com IA (chat)
  await bot.sendChatAction(chatId, "typing");
  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";
  const resposta = await askGPT(texto, modelo, chatId);

  if (resposta) {
    await registrarMensagem(chatId);
    return await bot.sendMessage(chatId, `🤖 ${resposta}`);
  } else {
    return await bot.sendMessage(chatId, "😔 Desculpe, a IA está indisponível no momento.");
  }
}
