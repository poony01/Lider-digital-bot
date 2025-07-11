// controllers/videoController.js
import { gerarVideoRunway } from "../services/runwayService.js";
import { registrarMensagem } from "../services/afiliadoService.js";

export async function processarComandoVideo(bot, chatId, texto, plano) {
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
