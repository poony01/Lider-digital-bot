import { askGPT } from "../services/iaService.js";
import { gerarImagemProfissional } from "../services/imageService.js";
import { obterAfiliado, registrarUsoGratis } from "./afiliadoService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;
  const userId = msg.from.id;

  if (!texto) return;

  const dados = await obterAfiliado(userId);
  const plano = dados?.plano;
  const usadoGratis = dados?.gratuito_usado || 0;

  // Geração de imagem com IA (comando: img ...)
  if (texto.toLowerCase().startsWith("img ")) {
    if (!plano) {
      if (usadoGratis >= 5) {
        return await bot.sendMessage(chatId, "😔 Você já usou suas 5 mensagens gratuitas. Assine um plano para continuar usando.");
      }
      await registrarUsoGratis(userId); // Conta como uso grátis
    }

    const prompt = texto.slice(4).trim();
    if (!prompt) {
      return await bot.sendMessage(chatId, "❗ Envie uma descrição para gerar a imagem. Exemplo:\n`img um leão usando óculos e terno`", {
        parse_mode: "Markdown",
      });
    }

    await bot.sendChatAction(chatId, "upload_photo");
    const url = await gerarImagemProfissional(prompt);

    if (url) {
      return await bot.sendPhoto(chatId, url, {
        caption: "🖼️ Imagem profissional gerada com IA!",
      });
    } else {
      return await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente.");
    }
  }

  // Acesso à IA com texto
  if (!plano) {
    if (usadoGratis >= 5) {
      return await bot.sendMessage(chatId, "😔 Você já usou suas 5 mensagens gratuitas. Assine um plano para continuar conversando com a IA.");
    }
    await registrarUsoGratis(userId); // Conta como uso grátis
  }

  await bot.sendChatAction(chatId, "typing");
  const resposta = await askGPT(texto, userId);

  if (resposta) {
    return await bot.sendMessage(chatId, `🤖 ${resposta}`, { parse_mode: "Markdown" });
  }

  return await bot.sendMessage(chatId, "❌ A IA está indisponível no momento.");
}
