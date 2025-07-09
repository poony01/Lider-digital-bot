// controllers/callbackController.js
import { gerarCobrancaPix } from "../services/pixService.js";
import { registrarConvite } from "../services/afiliadoService.js";

export async function tratarCallbackQuery(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  if (data.startsWith("plano_")) {
    const tipoPlano = data === "plano_basico" ? "basico" : "premium";

    try {
      // Verifica se o convite está no deep link (/start ID)
      const msgStart = query.message.reply_to_message?.text || "";
      const idConvite = msgStart.startsWith("/start ")
        ? msgStart.split(" ")[1]
        : null;

      // Salva o convite se existir
      if (idConvite && idConvite !== String(userId)) {
        await registrarConvite(userId, parseInt(idConvite));
      }

      const cobranca = await gerarCobrancaPix(tipoPlano, userId);

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
      const erroTexto = e.response?.data || e.message;
      console.error("🛠️ Detalhes:", erroTexto);

      await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
    }
  }
}
