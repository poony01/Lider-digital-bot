import { responderIA } from '../services/iaService.js';
import { gerarImagem } from '../services/imageService.js';

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (!texto) return;

  if (texto === "/start") {
    await bot.sendMessage(chatId, `🤖 Olá! Sou sua assistente com inteligência artificial.\n\n💬 Envie uma pergunta ou use:\n\n🖼️ *img descrição* para gerar uma imagem com IA.\n\nExemplo:\nimg uma mulher com vestido vermelho no campo`, { parse_mode: 'Markdown' });
    return;
  }

  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.replace("img ", "").trim();

    if (!prompt || prompt.length < 5) {
      return await bot.sendMessage(chatId, "❗ Descreva melhor a imagem. Ex: `img um cachorro astronauta na lua`");
    }

    const url = await gerarImagem(prompt);
    if (url) {
      await bot.sendPhoto(chatId, url, { caption: "🖼️ Imagem gerada com DALL·E 3" });
    } else {
      await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem.");
    }
    return;
  }

  const resposta = await responderIA(texto);
  await bot.sendMessage(chatId, resposta);
}
