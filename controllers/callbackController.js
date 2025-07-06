// controllers/callbackController.js
import { gerarCobrancaPix } from '../services/pixService.js';

export async function handleCallback(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Define plano e valor
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

  // Confirma clique no botão
  await bot.answerCallbackQuery(query.id);

  // Gera cobrança Pix
  const cobranca = await gerarCobrancaPix(valor, plano);

  if (!cobranca) {
    return await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
  }

  // Envia QR Code e Pix copia e cola
  await bot.sendPhoto(chatId, cobranca.qrCodeUrl, {
    caption: `✅ *${plano}*\n\n💳 Para ativar seu plano, escaneie o QR Code acima ou copie o código Pix abaixo:\n\n🔢 *Pix copia e cola:*\n\`\`\`${cobranca.copiaCola}\`\`\`\n\n⏱️ O pagamento expira em 1 hora.`,
    parse_mode: 'Markdown'
  });
}
