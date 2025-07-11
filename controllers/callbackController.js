import { gerarCobrancaPix } from "../services/pixService.js";

export async function tratarCallbackQuery(bot, callbackQuery) {
  const { data, message } = callbackQuery;
  const chatId = message.chat.id;
  const messageId = message.message_id;

  if (data === "ver_plano_basico") {
    await bot.deleteMessage(chatId, messageId);

    const texto = `🔍 *Plano Básico* – R$14,90

Com o plano básico, você poderá usar *5 recursos incríveis com IA*:

🧠 GPT-3.5 Turbo – respostas inteligentes  
🖼️ Criação de imagens profissionais  
🎙️ Transcrição de áudios  
🎬 Geração de vídeos simples  
✨ Acesso ilimitado aos recursos acima`;

    const botoes = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Assinar Plano Básico – R$14,90", callback_data: "assinar_basico" }],
          [{ text: "🔙 Voltar", callback_data: "voltar_planos" }],
        ],
      },
      parse_mode: "Markdown",
    };

    return await bot.sendMessage(chatId, texto, botoes);
  }

  if (data === "ver_plano_premium") {
    await bot.deleteMessage(chatId, messageId);

    const texto = `💎 *Plano Premium* – R$22,90

Com o plano premium, você desbloqueia *acesso total ao GPT-4 Turbo* e recursos avançados:

🤖 GPT-4 Turbo – maior inteligência e precisão  
📹 Geração de vídeos longos com imagens + texto  
🎨 Criação de imagens profissionais  
🧠 IA com respostas muito mais avançadas`;

    const botoes = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Assinar Plano Premium – R$22,90", callback_data: "assinar_premium" }],
          [{ text: "🔙 Voltar", callback_data: "voltar_planos" }],
        ],
      },
      parse_mode: "Markdown",
    };

    return await bot.sendMessage(chatId, texto, botoes);
  }

  if (data === "voltar_planos") {
    await bot.deleteMessage(chatId, messageId);

    const texto = `✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.

🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:

🧠 IA que responde perguntas  
🖼️ Geração de imagens com IA  
🎙️ Transcrição de áudios  
🎬 Geração de vídeos

🗂️ Após atingir o limite, será necessário ativar um plano.

*Escolha abaixo para desbloquear acesso completo:*`;

    const botoes = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔍 Conhecer Plano Básico", callback_data: "ver_plano_basico" }],
          [{ text: "💎 Conhecer Plano Premium", callback_data: "ver_plano_premium" }],
        ],
      },
      parse_mode: "Markdown",
    };

    return await bot.sendMessage(chatId, texto, botoes);
  }

  if (data === "assinar_basico") {
    await bot.deleteMessage(chatId, messageId);

    const cobranca = await gerarCobrancaPix(chatId, "basico");

    return await bot.sendPhoto(chatId, cobranca.qrCodeBase64, {
      caption: `✅ *Plano Básico* – R$14,90\n\nCopie o código abaixo e pague com seu app de banco:\n\n\`\`\`\n${cobranca.copiaCola}\n\`\`\`\n\nAssim que o pagamento for confirmado, o acesso será liberado automaticamente.`,
      parse_mode: "Markdown",
    });
  }

  if (data === "assinar_premium") {
    await bot.deleteMessage(chatId, messageId);

    const cobranca = await gerarCobrancaPix(chatId, "premium");

    return await bot.sendPhoto(chatId, cobranca.qrCodeBase64, {
      caption: `✅ *Plano Premium* – R$22,90\n\nCopie o código abaixo e pague com seu app de banco:\n\n\`\`\`\n${cobranca.copiaCola}\n\`\`\`\n\nAssim que o pagamento for confirmado, o acesso será liberado automaticamente.`,
      parse_mode: "Markdown",
    });
  }
}
