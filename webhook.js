import { bot } from './index.js';
import { askGPT } from './services/iaService.js';

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text } = update.message;

      // ✨ Boas-vindas com /start
      if (text === "/start") {
        await bot.sendMessage(chat.id, `👋 Olá, ${chat.first_name || "amigo(a)"}!\n\nBem-vindo(a) ao *Líder Digital Bot*, sua assistente com IA para criar imagens, responder dúvidas e muito mais!\n\nDigite uma pergunta ou envie:\n🖼️ *img* descrição da imagem\n\nEx: img um robô lendo livros na praia`, {
          parse_mode: "Markdown"
        });
        return res.status(200).send("Boas-vindas enviada");
      }

      // Exibe "digitando..." antes de responder
      await bot.sendChatAction(chat.id, "typing");

      // Resposta da IA
      const reply = await askGPT(text);
      await bot.sendMessage(chat.id, reply);
    }
    // Se quiser tratar callback_query, adicione aqui
  } catch (e) {
    console.error("Erro ao processar update:", e);
  }

  res.status(200).send("OK");
};
