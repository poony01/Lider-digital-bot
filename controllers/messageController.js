import { responderIA } from "../services/iaService.js";
import { gerarImagem } from "../services/imageService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "usuário";
  const texto = msg.text;

  if (!texto) return;

  // Mensagem de boas-vindas com botões de planos
  if (texto === "/start") {
    return await bot.sendMessage(chatId, `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 *IA que responde perguntas*\n🖼️ *Geração de imagens com IA*\n🎙️ *Transcrição de áudios*\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\nEscolha abaixo para desbloquear o acesso completo:`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔓 Assinar Plano Básico - R$14,90", callback_data: "assinar_basico" }],
          [{ text: "✨ Assinar Plano Premium - R$22,90", callback_data: "assinar_premium" }]
        ]
      }
    });
  }

  // Geração de imagem com DALL·E 3
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.replace("img ", "").trim();

    if (prompt.length < 5) {
      return await bot.sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um leão usando óculos e terno");
    }

    // Exibe animação de "enviando imagem"
    await bot.sendChatAction(chatId, "upload_photo");

    const url = await gerarImagem(prompt);
    if (url) {
      return await bot.sendPhoto(chatId, url, { caption: "🖼️ Aqui está sua imagem gerada com IA!" });
    } else {
      return await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente.");
    }
  }

  // Mostra "digitando..." enquanto processa a IA
  await bot.sendChatAction(chatId, "typing");

  // Resposta com IA e emojis animando a conversa
  const resposta = await responderIA(texto);
  return await bot.sendMessage(chatId, `🤖 ${resposta} ✨`);
}
