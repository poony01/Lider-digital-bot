// controllers/callbackController.js
import { gerarCobrancaPix } from "../services/pixService.js";

export async function handleCallback(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  let plano, valor;
  if (data === "assinar_basico") {
    plano = "Plano Básico - R$14,90/mês";
    valor = 14.90;
  } else if (data === "assinar_premium") {
    plano = "Plano Premium - R$22,90/mês";
    valor = 22.90;
  } else {
    return await bot.answerCallbackQuery(query.id, { text: "❌ Opção inválida." });
  }

  await bot.answerCallbackQuery(query.id);

  const cobranca = await gerarCobrancaPix(valor, plano);
  if (!cobranca) {
    return await bot.sendMessage(chatId, "❌ Erro ao gerar cobrança. Tente novamente.");
  }

  await bot.sendPhoto(chatId, cobranca.qrCodeUrl, {
    caption: `✅ *${plano}*\n\n💳 Escaneie o QR Code ou use o código abaixo para pagamento:\n\n\`\`\`${cobranca.copiaCola}\`\`\`\n\n⏱️ O pagamento expira em 1 hora.`,
    parse_mode: "Markdown"
  });
}
