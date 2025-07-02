// serviços/imagemService.js

import { verificarAssinaturaAtiva } from "../utils/controleAcesso.js";
import { gerarImagem } from "./openaiService.js";

export async function processarImagem(msg, bot) {
  const chatId = msg.chat.id;
  const texto = msg.text.trim();

  const possuiAcesso = await verificarAssinaturaAtiva(chatId);
  if (!possuiAcesso) {
    return bot.sendMessage(
      chatId,
      "🔒 Para gerar imagens, você precisa ter um plano ativo. Envie: assinatura"
    );
  }

  const prompt = texto.replace(/(imagem|criar imagem)/i, "").trim();
  if (!prompt) {
    return bot.sendMessage(chatId, "❗ Envie algo como: imagem de um leão no topo da montanha");
  }

  try {
    const urlImagem = await gerarImagem(prompt);
    await bot.sendPhoto(chatId, urlImagem, {
      caption: "✅ Imagem gerada com sucesso!"
    });
  } catch (erro) {
    console.error("Erro ao gerar imagem:", erro);
    bot.sendMessage(chatId, "❌ Erro ao gerar imagem. Tente novamente mais tarde.");
  }
}
