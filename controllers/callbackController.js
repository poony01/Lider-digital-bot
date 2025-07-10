// controllers/callbackController.js
import { gerarCobrancaPix, registrarPlanoERecompensa } from "../services/pixService.js";

// Objeto para armazenar temporariamente a escolha de plano de cada usuário
const planosEscolhidos = {};

export async function tratarCallbackQuery(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  // Usuário escolheu plano básico ou premium
  if (data === "plano_basico" || data === "plano_premium") {
    const tipoPlano = data === "plano_basico" ? "basico" : "premium";

    try {
      // Armazena temporariamente o plano escolhido
      planosEscolhidos[userId] = tipoPlano;

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
      console.error("❌ Erro ao gerar cobrança Pix:", e);
      await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
    }
  }

  // Verificação manual (simulação)
  if (data === "verificar_pagamento") {
    try {
      const tipoPlano = planosEscolhidos[userId];

      if (!tipoPlano) {
        return await bot.sendMessage(chatId, "❌ Não foi possível identificar o plano escolhido. Por favor, gere novamente o Pix.");
      }

      await registrarPlanoERecompensa(userId, tipoPlano);

      // Remove o plano temporário da memória
      delete planosEscolhidos[userId];

      await bot.sendMessage(chatId, `🎉 Pagamento confirmado! Seu plano *${tipoPlano}* foi ativado com sucesso!`, {
        parse_mode: "Markdown",
      });

    } catch (e) {
      console.error("❌ Erro ao ativar plano:", e);
      await bot.sendMessage(chatId, "❌ Ocorreu um erro ao ativar seu plano. Tente novamente.");
    }
  }
}
