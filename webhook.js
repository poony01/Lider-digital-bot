import { bot } from './index.js';
import { askGPT } from './services/iaService.js';
import { gerarImagemProfissional } from './services/imageService.js'; // Função avançada sugerida anteriormente

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text } = update.message;

      // Geração de imagem profissional quando começa com "img "
      if (text.toLowerCase().startsWith("img ")) {
        const prompt = text.slice(4).trim();
        if (!prompt) {
          await bot.sendMessage(chat.id, "❗ Envie uma descrição para gerar a imagem. Exemplo:\nimg um leão usando óculos e terno, estilo realista");
        } else {
          await bot.sendChatAction(chat.id, "upload_photo");
          const url = await gerarImagemProfissional(prompt);
          if (url) {
            await bot.sendPhoto(chat.id, url, {
              caption: "🖼️ Imagem profissional gerada com IA! Peça outra se quiser. 😃"
            });
          } else {
            await bot.sendMessage(chat.id, "❌ Não consegui gerar a imagem. Tente novamente ou altere a descrição.");
          }
        }
      } else {
        // Exibe "digitando..." antes de responder
        await bot.sendChatAction(chat.id, "typing");
        // Resposta da IA
        const reply = await askGPT(text);
        await bot.sendMessage(chat.id, reply);
      }
    }
    // Se quiser tratar callback_query, adicione aqui
  } catch (e) {
    console.error("Erro ao processar update:", e);
  }

  res.status(200).send("OK");
};
