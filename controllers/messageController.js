import { askGPT } from "../services/iaService.js";
import { gerarImagemProfissional } from "../services/imageService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (!texto) return;

  // Geração de imagem com IA quando começa com "img "
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.slice(4).trim();
    if (!prompt) {
      return await bot.sendMessage(chatId, "❗ Envie uma descrição para gerar a imagem. Exemplo:\nimg um leão usando óculos e terno, estilo realista");
    }
    await bot.sendChatAction(chatId, "upload_photo");
    const url = await gerarImagemProfissional(prompt);
    if (url) {
      return await bot.sendPhoto(chatId, url, {
        caption: "🖼️ Imagem profissional gerada com IA! Peça outra se quiser. 😃"
      });
    } else {
      return await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente ou altere a descrição.");
    }
  }

  // Caso contrário, responde com texto
  await bot.sendChatAction(chatId, "typing");
  const resposta = await askGPT(texto);
  return await bot.sendMessage(chatId, `🤖 ${resposta} ✨`);
}
