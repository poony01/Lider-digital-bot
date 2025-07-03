// controllers/commandController.js

export async function commandController(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (texto === "/imagem") {
    await bot.sendMessage(chatId, "🖼️ Função de geração de imagem em desenvolvimento.");
    return true;
  }

  if (texto === "/video") {
    await bot.sendMessage(chatId, "🎬 Em breve você poderá gerar vídeos com IA.");
    return true;
  }

  if (texto === "/voz") {
    await bot.sendMessage(chatId, "🎙️ Envie um áudio e tentarei converter para texto.");
    return true;
  }

  return false; // Se nenhum comando foi tratado
}
