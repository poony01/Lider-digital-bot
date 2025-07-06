// controllers/callbackController.js
import { gerarCobrancaPix } from "../services/pixService.js";

export async function handleCallback(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Plano Básico
  if (data === "assinar_basico") {
    const descricao = `🔓 *Plano Básico — R$14,90/mês*\n\nInclui:\n- 🤖 IA para perguntas e respostas\n- 🖼️ Geração de imagens simples\n- 🎧 Transcrição de áudios\n- 🛠️ Suporte básico\n\n*Pagamento via Pix abaixo:*`;
    const valor = 14.9;

    const { copiaECola, qrCodeUrl } = await gerarCobrancaPix(chatId, valor, "Plano Básico");

    await bot.sendMessage(chatId, descricao, { parse_mode: "Markdown" });
    await bot.sendPhoto(chatId, qrCodeUrl, { caption: `💰 *Pix Copia e Cola:*\n\`\`\`${copiaECola}\`\`\``, parse_mode: "Markdown" });

    return await bot.answerCallbackQuery(query.id); // fecha o "carregando"
  }

  // Plano Premium
  if (data === "assinar_premium") {
    const descricao = `✨ *Plano Premium — R$22,90/mês*\n\nInclui tudo do básico, mais:\n- 🎥 Geração de vídeos com IA\n- 🖼️ Imagens realistas com DALL·E 3\n- 💬 Respostas mais longas\n- ⚡ Suporte prioritário\n\n*Pagamento via Pix abaixo:*`;
    const valor = 22.9;

    const { copiaECola, qrCodeUrl } = await gerarCobrancaPix(chatId, valor, "Plano Premium");

    await bot.sendMessage(chatId, descricao, { parse_mode: "Markdown" });
    await bot.sendPhoto(chatId, qrCodeUrl, { caption: `💰 *Pix Copia e Cola:*\n\`\`\`${copiaECola}\`\`\``, parse_mode: "Markdown" });

    return await bot.answerCallbackQuery(query.id);
  }

  // Desconhecido
  await bot.answerCallbackQuery(query.id, { text: "Comando não reconhecido." });
}
