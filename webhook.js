// webhook.js
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// IA com resposta rápida
async function askGPT(prompt, model = "gpt-3.5-turbo") {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: "Você é um assistente útil no Telegram." },
          { role: "user", content: prompt }
        ],
        max_tokens: 600, // reduz o tempo de espera
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("Erro GPT:", err.response?.data || err.message);
    return "⚠️ Erro ao consultar a IA.";
  }
}

// Geração de imagem com DALL·E 3
async function gerarImagem(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd"
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.data?.[0]?.url || null;
  } catch (err) {
    console.error("Erro DALL-E:", err.response?.data || err.message);
    return null;
  }
}

// Webhook principal
export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message?.text) {
      const { chat, text } = update.message;

      // Geração de imagem
      if (text.toLowerCase().startsWith("img ")) {
        const prompt = text.slice(4).trim();
        if (!prompt) {
          return await bot.sendMessage(chat.id, "❗ Envie um prompt válido. Exemplo:\nimg um robô estudando na biblioteca");
        }

        await bot.sendChatAction(chat.id, "upload_photo");
        const imageUrl = await gerarImagem(prompt);

        if (imageUrl) {
          return await bot.sendPhoto(chat.id, imageUrl);
        } else {
          return await bot.sendMessage(chat.id, "❌ Erro ao gerar imagem. Tente novamente.");
        }
      }

      // Resposta com IA
      await bot.sendChatAction(chat.id, "typing");
      const resposta = await askGPT(text);
      await bot.sendMessage(chat.id, resposta);
    }
  } catch (e) {
    console.error("Erro ao processar update:", e);
    await bot.sendMessage(update?.message?.chat?.id, "❌ Ocorreu um erro. Tente novamente.");
  }

  res.status(200).send("OK");
};
