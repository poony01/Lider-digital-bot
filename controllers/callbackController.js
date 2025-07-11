import { obterAfiliado, gerarCobranca } from "../services/afiliadoService.js";
import { botoesPlanos, textoPlanoBasico, textoPlanoPremium } from "../services/uiService.js";

export async function tratarCallbackQuery(bot, callbackQuery) {
  const { message, data } = callbackQuery;
  const chatId = message.chat.id;
  const messageId = message.message_id;

  if (data === "voltar") {
    await bot.deleteMessage(chatId, messageId);
    return await bot.sendMessage(chatId, botoesPlanos.texto, botoesPlanos.opcoes);
  }

  if (data === "ver_plano_basico") {
    await bot.deleteMessage(chatId, messageId);
    return await bot.sendMessage(chatId, textoPlanoBasico.texto, textoPlanoBasico.botoes);
  }

  if (data === "ver_plano_premium") {
    await bot.deleteMessage(chatId, messageId);
    return await bot.sendMessage(chatId, textoPlanoPremium.texto, textoPlanoPremium.botoes);
  }

  if (data === "assinar_premium") {
    await bot.deleteMessage(chatId, messageId);
    const cobranca = await gerarCobranca(chatId, "premium");
    const texto = `💎 *Plano Premium - R$22,90*\n\nEscaneie o QR Code ou copie o código abaixo para pagar:\n\n*Copie e cole no app do banco:* \n\`${cobranca.copiaecola}\``;
    await bot.sendPhoto(chatId, cobranca.qr_code, {
      caption: texto,
      parse_mode: "Markdown",
    });
  }

  if (data === "assinar_basico") {
    await bot.deleteMessage(chatId, messageId);
    const cobranca = await gerarCobranca(chatId, "basico");
    const texto = `🔓 *Plano Básico - R$14,90*\n\nEscaneie o QR Code ou copie o código abaixo para pagar:\n\n*Copie e cole no app do banco:* \n\`${cobranca.copiaecola}\``;
    await bot.sendPhoto(chatId, cobranca.qr_code, {
      caption: texto,
      parse_mode: "Markdown",
    });
  }
}
