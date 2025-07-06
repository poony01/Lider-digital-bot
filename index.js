import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const MAX_FREE_MESSAGES = 5;
const usuarios = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "usuário";

  bot.sendMessage(chatId, `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*.\n\n🎁 Plano gratuito com *${MAX_FREE_MESSAGES} mensagens*:\n\n🧠 Perguntas com IA\n🖼️ Geração de imagens com IA (DALL·E 3)\n\nDigite algo ou envie:\n*img um leão usando óculos de sol*`, {
    parse_mode: "Markdown"
  });

  if (!usuarios[chatId]) {
    usuarios[chatId] = { mensagens: 0 };
  }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (!texto || texto.startsWith("/start")) return;

  if (!usuarios[chatId]) {
    usuarios[chatId] = { mensagens: 0 };
  }

  if (usuarios[chatId].mensagens >= MAX_FREE_MESSAGES) {
    return bot.sendMessage(chatId, `⚠️ Você atingiu o limite de *${MAX_FREE_MESSAGES} mensagens gratuitas*.`, { parse_mode: "Markdown" });
  }

  // Geração de imagem
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.slice(4).trim();
    if (prompt.length < 5) {
      return bot.sendMessage(chatId, "❗ Descreva melhor a imagem. Exemplo:\nimg um cachorro astronauta na lua");
    }

    const imagem = await gerarImagemDalle3(prompt);
    if (imagem) {
      bot.sendPhoto(chatId, imagem, { caption: `🖼️ Imagem gerada com IA (DALL·E 3)` });
    } else {
      bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente.");
    }

    usuarios[chatId].mensagens++;
    return;
  }

  // IA - resposta com ChatGPT
  const resposta = await responderIA(texto);
  bot.sendMessage(chatId, resposta);

  usuarios[chatId].mensagens++;
});

// 🧠 Função IA (ChatGPT)
async function responderIA(pergunta) {
  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // ou gpt-4-turbo se preferir
        messages: [{ role: "user", content: pergunta }]
      })
    });

    const json = await resposta.json();
    return json.choices?.[0]?.message?.content || "❌ Erro ao responder.";
  } catch (e) {
    return "❌ Erro ao conectar à IA.";
  }
}

// 🎨 Função gerar imagem com DALL·E 3
async function gerarImagemDalle3(prompt) {
  try {
    const resposta = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const json = await resposta.json();
    return json.data?.[0]?.url || null;
  } catch (e) {
    return null;
  }
}
