// webhook.js
import { gerarImagem } from './services/imageService.js';
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("Bot online ✅");

  const body = req.body;

  if (body?.message) {
    const chatId = body.message.chat.id;
    const texto = body.message.text;

    // 🖼️ Geração de imagem com DALL·E 3 (via imageService)
    if (texto?.toLowerCase().startsWith("img ")) {
      const prompt = texto.replace("img ", "").trim();
      if (prompt.length < 5) {
        await sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um robô lendo livros na biblioteca");
        return res.status(200).send("Prompt curto");
      }

      try {
        const imageUrl = await gerarImagem(prompt);
        if (imageUrl) {
          await sendPhoto(chatId, imageUrl);
          return res.status(200).send("Imagem gerada");
        } else {
          await sendMessage(chatId, "❌ Erro ao gerar a imagem. Tente novamente.");
          return res.status(200).send("Erro imagem");
        }
      } catch (e) {
        console.error("Erro ao gerar imagem:", e);
        await sendMessage(chatId, "❌ Erro ao gerar imagem. Tente novamente.");
        return res.status(200).send("Erro DALL·E");
      }
    }

    // 💬 Resposta com IA (texto normal)
    try {
      const resposta = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: texto }]
      });

      const respostaTexto = resposta.data.choices[0].message.content;
      await sendMessage(chatId, respostaTexto);
    } catch (e) {
      console.error("Erro IA:", e);
      await sendMessage(chatId, "❌ Erro ao responder. Tente novamente.");
    }

    return res.status(200).send("OK");
  }

  res.status(200).send("Nada a fazer");
};

// 📤 Envia mensagem para o usuário
const sendMessage = async (chatId, text) => {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
};

// 📤 Envia imagem para o usuário
const sendPhoto = async (chatId, photoUrl) => {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl })
  });
};
