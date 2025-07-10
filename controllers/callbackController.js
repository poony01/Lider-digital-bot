// controllers/callbackController.js
import { gerarCobrancaPix, registrarPlanoERecompensa } from "../services/pixService.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function tratarCallbackQuery(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  // Escolha de plano: básico ou premium
  if (data === "plano_basico" || data === "plano_premium") {
    const tipoPlano = data === "plano_basico" ? "basico" : "premium";

    try {
      // ✅ Salva escolha temporária no Supabase
      await supabase
        .from("afiliados")
        .update({ plano_temp: tipoPlano })
        .eq("user_id", userId);

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

  // ✅ Verificação manual de pagamento
  if (data === "verificar_pagamento") {
    try {
      await bot.answerCallbackQuery(query.id, { text: "⏳ Verificando pagamento..." });

      // ✅ Recupera o plano temporário do Supabase
      const { data: usuario } = await supabase
        .from("afiliados")
        .select("plano_temp")
        .eq("user_id", userId)
        .single();

      const tipoPlano = usuario?.plano_temp;

      if (!tipoPlano) {
        await bot.sendMessage(chatId, "❌ Não foi possível identificar o plano selecionado. Toque novamente no botão de plano.");
        return;
      }

      // ✅ Ativa o plano
      await registrarPlanoERecompensa(userId, tipoPlano);

      // ✅ Limpa o campo plano_temp
      await supabase
        .from("afiliados")
        .update({ plano_temp: null })
        .eq("user_id", userId);

      await bot.sendMessage(chatId, `🎉 Pagamento confirmado! Seu plano *${tipoPlano}* foi ativado com sucesso!`, {
        parse_mode: "Markdown"
      });

    } catch (e) {
      console.error("❌ Erro ao ativar plano:", e);
      await bot.sendMessage(chatId, "❌ Ocorreu um erro ao ativar seu plano.");
    }
  }
}
