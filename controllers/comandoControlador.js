import { gerarImagemIA } from "../serviços/imagemService.js";
import { gerarVideoIA } from "../serviços/videoService.js";
import { responderIA } from "../serviços/iaService.js";
import { verificarAcesso } from "../utils/verificacaoAcesso.js";

export async function comandoControlador(msg, bot) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (!texto) return;

  if (texto.startsWith("criar imagem")) {
    const descricao = texto.replace("criar imagem", "").trim();

    const permitido = await verificarAcesso(chatId);
    if (!permitido) {
      await bot.sendMessage(chatId, "🔒 Recurso disponível apenas para assinantes.\nEnvie *plano* para ativar.");
      return;
    }

    if (!descricao) {
      await bot.sendMessage(chatId, "Envie: criar imagem do [tema]. Ex: criar imagem do mar");
      return;
    }

    await bot.sendMessage(chatId, "🖼️ Gerando imagem, aguarde...");
    const url = await gerarImagemIA(descricao);
    await bot.sendPhoto(chatId, url);

  } else if (texto.startsWith("fazer vídeo")) {
    const prompt = texto.replace("fazer vídeo", "").trim();

    const permitido = await verificarAcesso(chatId);
    if (!permitido) {
      await bot.sendMessage(chatId, "🔒 Recurso disponível apenas para assinantes.\nEnvie *plano* para ativar.");
      return;
    }

    if (!prompt) {
      await bot.sendMessage(chatId, "Envie: fazer vídeo sobre [tema]. Ex: fazer vídeo sobre vendas");
      return;
    }

    await bot.sendMessage(chatId, "🎬 Criando vídeo, aguarde...");
    const url = await gerarVideoIA(prompt);
    await bot.sendVideo(chatId, url);

  } else {
    // Caso seja outro comando, passar para a IA responder normalmente
    await responderIA(chatId, texto, bot);
  }
}
