// webhook.js
import { bot } from "./index.js";
import { askGPT } from "./services/iaService.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";
import {
  salvarConvite,
  obterAfiliado,
  zerarSaldo,
  listarUsuarios,
} from "./services/afiliadoService.js";

const OWNER_ID = Number(process.env.OWNER_ID);

export default async (req, res) => {
  const body = req.body;

  if (body.message) {
    const message = body.message;
    const chat = message.chat;
    const userId = message.from.id;
    const text = message.text || "";
    const from = message.from;
    const nome = from.first_name || "usuário";

    if (text.startsWith("/start")) {
      const indicadoPor = Number(text.split(" ")[1]);
      if (indicadoPor && indicadoPor !== userId) {
        await salvarConvite(userId, indicadoPor);
      }

      const mensagem = `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n🎬 Geração de vídeos\n\n🗂️ Após atingir o limite, será necessário ativar um plano.\n\nAproveite para testar agora mesmo!`;

      return await bot.sendMessage(chat.id, mensagem, {
        parse_mode: "Markdown",
      });
    }

    await askGPT(text, userId, chat.id);
  }

  if (body.callback_query) {
    await tratarCallbackQuery(body.callback_query);
  }

  res.send("ok");
};
