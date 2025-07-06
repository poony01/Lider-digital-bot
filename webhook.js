// webhook.js
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

    // 🖼️ Geração de imagem com DALL·E 3
    if (texto?.toLowerCase().startsWith("img ")) {
      const prompt = texto.replace("img ", "").trim();
      if (prompt.length < 5) {
        return await sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um robô lendo livros na biblioteca");
      }

      try {
        const resposta = await openai.createImage({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024"
        });

        const imageUrl = resposta.data.data[0].url;
        await sendPhoto(chatId, imageUrl);
      } catch (e) {
        console.error("Erro ao gerar imagem:", e);
        await sendMessage(chatId, "❌ Erro ao gerar imagem. Tente novamente.");
      }
      return res.status(200).send("Imagem gerada");
    }

    // 💬 Resposta de IA normal
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

// Funções auxiliares para enviar mensagens e imagens
const sendMessage = async (chatId, text) => {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
};

const sendPhoto = async (chatId, photoUrl) => {
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl })
  });
};
