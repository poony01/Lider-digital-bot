import { gerarCobrancaPix } from "../services/pixService.js";
import fetch from "node-fetch";

// Trata cliques nos botões de planos
export async function handleCallback(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  let plano, valor;

  // Define o plano escolhido
  if (data === "assinar_basico") {
    plano = "Plano Básico - R$14,90/mês";
    valor = 14.90;
  } else if (data === "assinar_premium") {
    plano = "Plano Premium - R$22,90/mês";
    valor = 22.90;
  } else {
    await bot.answerCallbackQuery(query.id, { text: "❌ Opção inválida." });
    return;
  }

  // Confirma o clique
  await bot.answerCallbackQuery(query.id);

  // Informa que está gerando cobrança
  await bot.sendMessage(chatId, "⏳ Gerando cobrança Pix...");

  // Gera cobrança Pix
  const cobranca = await gerarCobrancaPix(valor, plano);

  if (!cobranca) {
    await bot.sendMessage(chatId, "❌ Erro ao gerar Pix. Tente novamente mais tarde.");
    return;
  }

  // Envia o QR Code e Pix copia e cola
  await bot.sendPhoto(chatId, cobranca.qrCodeUrl, {
    caption: `✅ *${plano}*\n\n💳 Para ativar seu plano, escaneie o QR Code ou copie o código Pix abaixo:\n\n\`\`\`${cobranca.copiaCola}\`\`\`\n\n⏱️ *Pagamento válido por 1 hora*`,
    parse_mode: "Markdown"
  });
}
