// controllers/callbackController.js
import { gerarCobrancaPix } from "../services/pixService.js";

export async function tratarCallbackQuery(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  if (data === "plano_basico" || data === "plano_premium") {
    const tipoPlano = data === "plano_basico" ? "basico" : "premium";

    try {
      const cobranca = await gerarCobrancaPix(tipoPlano, userId);

      if (!cobranca || !cobranca.codigoPix || !cobranca.imagemUrl) {
        throw new Error("Cobrança gerada incompleta ou inválida.");
      }

      await bot.sendMessage(chatId, cobranca.texto, {
        parse_mode: "Markdown",
      });

      await bot.sendPhoto(chatId, cobranca.imagemUrl, {
        caption: `📌 *Pix copia e cola:*\n\`\`\`${cobranca.codigoPix}\`\`\`\n\n⏱️ O QR Code expira em 1 hora.`,
        parse_mode: "Markdown",
      });

      await bot.sendMessage(chatId, "Após o pagamento, toque abaixo para verificar se o plano já foi ativado:", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Verificar Pagamento", callback_data: "verificar_pagamento" }],
          ],
        },
      });

    } catch (e) {
      console.error("❌ Erro ao gerar cobrança Pix:");
      if (e.response) {
        try {
          const errorText = await e.response.text();
          console.error("🔍 Resposta da API:", errorText);
        } catch {
          console.error("🔍 Erro de rede ou JSON inválido");
        }
      } else {
        console.error(e.message || e);
      }

      await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
    }
  }
}
