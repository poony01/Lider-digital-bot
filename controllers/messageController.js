// controllers/messageController.js
import { responderIA } from '../services/iaService.js';
import { gerarImagem } from '../services/imageService.js';

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (!texto) return;

  // 🎉 Mensagem de boas-vindas
  if (texto === "/start") {
    return await bot.sendMessage(chatId, `👋 Olá! Seja bem-vindo(a) ao *Líder Digital Bot*.\n\nVocê pode usar os seguintes comandos:\n\n🧠 Pergunte algo com IA\n🖼️ Gere uma imagem com o comando:\n*img descrição da imagem*\n\nExemplo:\nimg um leão usando terno elegante em Nova York`, {
      parse_mode: "Markdown"
    });
  }

  // 🖼️ Geração de imagem
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.replace("img ", "").trim();
    if (prompt.length < 5) {
      return await bot.sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um astronauta na lua segurando uma bandeira do Brasil");
    }

    const url = await gerarImagem(prompt);
    if (url) {
      return await bot.sendPhoto(chatId, url);
    } else {
      return await bot.sendMessage(chatId, "❌ Erro ao gerar imagem.");
    }
  }

  // 💬 Resposta com IA
  const resposta = await responderIA(texto);
  await bot.sendMessage(chatId, resposta);
}
