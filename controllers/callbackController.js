// controllers/callbackController.js
import { gerarCobrancaPix } from "../services/pixService.js";

export async function tratarCallbackQuery(bot, callback) {
  const chatId = callback.message.chat.id;
  const userId = callback.from.id;
  const nome = callback.from.first_name || "usuário";
  const data = callback.data;

  try {
    await bot.deleteMessage(chatId, callback.message.message_id);

    // ➤ Mostrar plano básico
    if (data === "ver_plano_basico") {
      const texto = `🔍 *Plano Básico - R$19,90/mês*\n\n✅ Acesso ao GPT-3.5 Turbo (respostas rápidas e inteligentes)\n🧠 Criação de imagens profissionais com IA\n🚫 Sem limite de mensagens\n\nIdeal para quem quer produtividade com baixo custo.`;

      const botoes = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "💳 Assinar Plano Básico - R$19,90", callback_data: "assinar_basico" }],
            [{ text: "🔙 Voltar", callback_data: "voltar_planos" }],
          ],
        },
        parse_mode: "Markdown"
      };

      return await bot.sendMessage(chatId, texto, botoes);
    }

    // ➤ Mostrar plano premium
    if (data === "ver_plano_premium") {
      const texto = `💎 *Plano Premium - R$34,90/mês*\n\n✅ Acesso completo ao GPT-4 Turbo (o mais avançado)\n🎬 Criação de vídeos com texto ou imagem\n🧠 Geração de imagem profissional\n🎙️ Narração ou música nos vídeos (opcional)\n🚫 Sem limite de mensagens\n\nPerfeito para criadores de conteúdo e empresas.`;

      const botoes = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "💳 Assinar Plano Premium - R$34,90", callback_data: "assinar_premium" }],
            [{ text: "🔙 Voltar", callback_data: "voltar_planos" }],
          ],
        },
        parse_mode: "Markdown"
      };

      return await bot.sendMessage(chatId, texto, botoes);
    }

    // ➤ Voltar para escolha de plano
    if (data === "voltar_planos") {
      const mensagem = `👋 Olá, ${nome}!\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n🎬 Geração de vídeos\n\n*Escolha abaixo para desbloquear acesso completo:*`;

      const botoes = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔍 Conhecer Plano Básico", callback_data: "ver_plano_basico" }],
            [{ text: "💎 Conhecer Plano Premium", callback_data: "ver_plano_premium" }],
          ],
        },
        parse_mode: "Markdown"
      };

      return await bot.sendMessage(chatId, mensagem, botoes);
    }

    // ➤ Gerar cobrança Pix (básico ou premium)
    if (data === "assinar_basico" || data === "assinar_premium") {
      const plano = data === "assinar_basico" ? "basico" : "premium";
      const pagamento = await gerarCobrancaPix(chatId, plano);

      return await bot.sendPhoto(chatId, pagamento.qrCodeBase64, {
        caption: `💳 *Pagamento via Pix*\n\nPlano: *${pagamento.plano}*\nValor: *R$ ${pagamento.valor}*\n\nCopie o código abaixo ou escaneie o QR Code:\n\n\`${pagamento.copiaCola}\``,
        parse_mode: "Markdown"
      });
    }

  } catch (err) {
    console.error("❌ Erro no callback:", err);
    return await bot.sendMessage(chatId, "❌ Ocorreu um erro. Tente novamente.");
  }
}
