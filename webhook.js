import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function askGPT(prompt, model = "gpt-3.5-turbo") {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [
      { role: "system", content: "Você é um assistente útil do Telegram." },
      { role: "user", content: prompt }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error("Erro GPT:", await response.text());
    return "Desculpe, houve um erro ao falar com a IA.";
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Sem resposta da IA.";
}

async function gerarImagem(prompt) {
  const url = "https://api.openai.com/v1/images/generations";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd"
      })
    });
    if (!response.ok) {
      console.error("Erro DALL-E:", await response.text());
      return null;
    }
    const data = await response.json();
    return data.data?.[0]?.url || null;
  } catch (err) {
    console.error("Erro ao gerar imagem:", err);
    return null;
  }
}

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text } = update.message;

      if (text.toLowerCase().startsWith("img ")) {
        const prompt = text.slice(4).trim();
        if (!prompt) {
          return await bot.sendMessage(chat.id, "❗ Envie uma descrição para gerar a imagem. Exemplo:\nimg um leão usando óculos e terno, estilo realista");
        }
        await bot.sendChatAction(chat.id, "upload_photo");
        const url = await gerarImagem(prompt);
        if (url) {
          return await bot.sendPhoto(chat.id, url, {
            caption: "🖼️ Imagem gerada com IA!"
          });
        } else {
          return await bot.sendMessage(chat.id, "❌ Não consegui gerar a imagem. Tente novamente ou altere a descrição.");
        }
      } else {
        await bot.sendChatAction(chat.id, "typing");
        const reply = await askGPT(text);
        await bot.sendMessage(chat.id, reply);
      }
    }
  } catch (e) {
    console.error("Erro ao processar update:", e);
  }

  res.status(200).send("OK");
};
