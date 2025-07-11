// controllers/videoController.js
import { criarVideoRunway } from "../services/runwayService.js";
import { obterAfiliado } from "../services/afiliadoService.js";

const OWNER_ID = Number(process.env.OWNER_ID);

export async function processarPedidoDeVideo(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text.toLowerCase();

  const usuario = await obterAfiliado(chatId);
  const plano = usuario?.plano;
  const dono = chatId === OWNER_ID;

  if (plano !== "premium" && !dono) {
    return await bot.sendMessage(chatId, "🚫 Apenas usuários com o plano *Premium* podem gerar vídeos com IA.", {
      parse_mode: "Markdown",
    });
  }

  // Detecta comando
  const temImagem = msg.photo?.length > 0;
  const temTexto = texto.includes("vídeo de") || texto.includes("criar vídeo");
  const temAudio = texto.includes("música") || texto.includes("narração") || texto.includes("voz");

  const segundosRegex = /(\d{1,3})\s*(segundos|s)/i;
  const match = texto.match(segundosRegex);
  const duracao = match ? parseInt(match[1]) : 10;

  // Extrai prompt
  const prompt = texto.replace(/(criar|crie)?\s*vídeo( de)?/i, "").trim();

  if (!prompt && !temImagem) {
    return await bot.sendMessage(chatId, "❗ Envie um texto ou uma imagem com o pedido do vídeo.");
  }

  await bot.sendChatAction(chatId, "upload_video");
  await bot.sendMessage(chatId, "🎬 Criando seu vídeo, isso pode levar até 1 minuto...");

  let imageUrl = null;

  // Se for imagem enviada
  if (temImagem) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const file = await bot.getFile(fileId);
    imageUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
  }

  const videoUrl = await criarVideoRunway({
    prompt: prompt || "Geração de vídeo com imagem",
    imageUrl,
    duration: duracao,
    audio: temAudio ? "music" : null,
  });

  if (videoUrl) {
    return await bot.sendVideo(chatId, videoUrl, {
      caption: `✅ Vídeo gerado com IA (${duracao} segundos)!`,
    });
  } else {
    return await bot.sendMessage(chatId, "❌ Ocorreu um erro ao gerar o vídeo. Tente novamente.");
  }
}
