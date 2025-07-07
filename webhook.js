// webhook.js
import { bot } from "./index.js";
import { askGPT } from "./services/iaService.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    // ✅ Mensagens de texto
    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const nome = from?.first_name || "usuário";

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

      // ✅ Chat IA
      await bot.sendChatAction(chat.id, "typing");
      const reply = await askGPT(text);
      await bot.sendMessage(chat.id, reply);
    }

    // ✅ Cliques nos botões inline
    if (update.callback_query) {
      await tratarCallbackQuery(bot, update.callback_query);
      return res.status(200).send("Callback tratado");
    }

  } catch (e) {
    console.error("Erro no webhook:", e);
    await bot.sendMessage(update.message?.chat.id || update.callback_query?.message.chat.id, "❌ Ocorreu um erro. Tente novamente.");
  }

  res.status(200).send("OK");
};
