
import { gerarCobrancaPix } from "../services/pixService.js";

export async function tratarCallbackQuery(bot, query) {
  const { data, message, from } = query;
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const nome = from.first_name || "usuário";

  // Plano Básico - funcionalidades
  const textoBasico = `*📘 Plano Básico – R$14,90/mês*

🔹 Acesso ao Chat com IA (GPT-3.5)
🧠 Respostas inteligentes e rápidas
🖼️ Geração de imagens com IA
🎧 Transcrição de áudios

Ideal para quem quer praticidade no dia a dia!`;

  // Plano Premium - funcionalidades
  const textoPremium = `*👑 Plano Premium – R$22,90/mês*

🔹 Acesso completo com IA GPT-4 Turbo
🎬 Geração de vídeos longos a partir de texto
🧠 Respostas mais rápidas e inteligentes
🖼️ Geração de imagens com maior qualidade
🎧 Transcrição de áudios

Recomendado para quem quer o máximo da tecnologia!`;

  const botoesVoltarAssinar = (plano) => ({
    reply_markup: {
      inline_keyboard: [
        [{ text: `✅ Assinar Plano ${plano === "basico" ? "Básico" : "Premium"} – R$${plano === "basico" ? "14,90" : "22,90"}`, callback_data: `assinar_${plano}` }],
        [{ text: "🔙 Voltar", callback_data: "voltar_planos" }],
      ],
    },
    parse_mode: "Markdown",
  });

  if (data === "conhecer_basico") {
    return await bot.editMessageText(textoBasico, {
      chat_id: chatId,
      message_id: messageId,
      ...botoesVoltarAssinar("basico"),
    });
  }

  if (data === "conhecer_premium") {
    return await bot.editMessageText(textoPremium, {
      chat_id: chatId,
      message_id: messageId,
      ...botoesVoltarAssinar("premium"),
    });
  }

  if (data === "voltar_planos") {
    const texto = `✅ *Seja bem-vindo(a) ao Líder Digital Bot*, sua assistente com inteligência artificial.

🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:

🧠 IA que responde perguntas
🖼️ Geração de imagens com IA
🎧 Transcrição de áudios
🎬 Geração de vídeos

📌 Após atingir o limite, será necessário ativar um plano.

Escolha abaixo para desbloquear acesso completo:`;

    return await bot.editMessageText(texto, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "📘 Conhecer Plano Básico", callback_data: "conhecer_basico" }],
          [{ text: "👑 Conhecer Plano Premium", callback_data: "conhecer_premium" }],
        ],
      },
      parse_mode: "Markdown",
    });
  }

  if (data === "assinar_basico" || data === "assinar_premium") {
    const plano = data.split("_")[1];

    try {
      const pagamento = await gerarCobrancaPix(chatId, plano);

      const texto = `✅ *Plano ${plano === "basico" ? "Básico" : "Premium"} – R$${pagamento.valor}*

Copie o código abaixo para pagar via Pix ou escaneie o QR Code:`;

      return await bot.editMessageMedia(
        {
          type: "photo",
          media: `data:image/png;base64,${pagamento.qrCodeBase64}`,
          caption: texto + `

\`\`\`
${pagamento.copiaCola}
\`\`\``,
          parse_mode: "Markdown",
        },
        {
          chat_id: chatId,
          message_id: messageId,
        }
      );
    } catch (e) {
      return await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
    }
  }
}
