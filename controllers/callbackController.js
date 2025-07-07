// controllers/callbackController.js
import { gerarCobrancaPix } from "../pixService.js";

export async function tratarCallbackQuery(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  if (data === "plano_basico" || data === "plano_premium") {
    const tipoPlano = data === "plano_basico" ? "basico" : "premium";

    try {
      const cobranca = await gerarCobrancaPix(tipoPlano, userId);

      await bot.sendMessage(chatId, cobranca.texto, { parse_mode: "Markdown" });

      await bot.sendPhoto(chatId, cobranca.imagemUrl, {
        caption: `📌 *Copia e Cola Pix:*\n\`\`\`${cobranca.codigoPix}\`\`\`\n\nO QR Code expira em 1 hora.`,
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
      console.error("Erro no callback do plano:", e);
      await bot.sendMessage(chatId, "❌ Ocorreu um erro ao gerar o Pix. Tente novamente.");
    }
  }
}
