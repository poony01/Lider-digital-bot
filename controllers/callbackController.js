// controllers/callbackController.js
import { gerarCobrancaPix } from '../services/pixService.js';

export async function handleCallback(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  let plano, valor;
  if (data === 'assinar_basico') {
    plano = 'Plano Básico - R$14,90/mês';
    valor = 14.90;
  } else if (data === 'assinar_premium') {
    plano = 'Plano Premium - R$22,90/mês';
    valor = 22.90;
  } else {
    return await bot.answerCallbackQuery(query.id, { text: '❌ Opção inválida.' });
  }

  await bot.answerCallbackQuery(query.id);

  const cobranca = await gerarCobrancaPix(valor, plano);

  if (!cobranca) {
    return await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
  }

  await bot.sendPhoto(chatId, cobranca.qrCodeUrl, {
    caption: `✅ *${plano}*\n\n💳 Para ativar seu plano, escaneie o QR Code acima ou copie o código Pix abaixo:\n\n\`\`\`${cobranca.copiaCola}\`\`\`\n\n⏱️ Pagamento expira em 1 hora.`,
    parse_mode: 'Markdown'
  });
}
