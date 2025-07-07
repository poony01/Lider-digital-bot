import { bot } from './index.js';
import { askGPT } from './services/iaService.js';
import { gerarCobrancaPix } from './services/pixService.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    // Mensagem de texto normal
    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const nome = from?.first_name || "usuário";

      // ✅ Mensagem de boas-vindas ao enviar /start
      if (text === "/start") {
        const boasVindas = `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n🎞️ Geração de vídeos\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\nEscolha abaixo para desbloquear acesso completo:`;

        await bot.sendMessage(chat.id, boasVindas, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔓 Assinar Plano Básico – R$14,90", callback_data: "plano_basico" }],
              [{ text: "✨ Assinar Plano Premium – R$22,90", callback_data: "plano_premium" }]
            ]
          }
        });
        return res.status(200).send("Boas-vindas enviadas");
      }

      // ✅ Chat IA normal
      await bot.sendChatAction(chat.id, "typing");
      const reply = await askGPT(text);
      await bot.sendMessage(chat.id, reply);
    }

    // ✅ Tratamento de clique no botão (callback)
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;

      let plano, valor;
      if (query.data === "plano_basico") {
        plano = "Plano Básico – R$14,90/mês";
        valor = 14.90;
      } else if (query.data === "plano_premium") {
        plano = "Plano Premium – R$22,90/mês";
        valor = 22.90;
      } else {
        await bot.answerCallbackQuery(query.id, { text: "❌ Opção inválida." });
        return res.status(200).send("Callback inválido");
      }

      await bot.answerCallbackQuery(query.id);

      // Gera cobrança Pix
      const cobranca = await gerarCobrancaPix(valor, plano);

      if (!cobranca) {
        await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
        return res.status(200).send("Erro Pix");
      }

      // Envia QR Code e código Pix
      await bot.sendPhoto(chatId, cobranca.qrCodeUrl, {
        caption: `✅ *${plano}*\n\nPara ativar seu plano, escaneie o QR Code acima ou copie o código Pix abaixo:\n\n🔢 *Pix copia e cola:*\n\`\`\`${cobranca.copiaCola}\`\`\`\n\n⏱️ O pagamento expira em 1 hora.`,
        parse_mode: "Markdown"
      });

      return res.status(200).send("Pagamento enviado");
    }

  } catch (e) {
    console.error("Erro no webhook:", e);
  }

  res.status(200).send("OK");
};
