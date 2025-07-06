// index.js
import TelegramBot from "node-telegram-bot-api";
import { responderIA } from "./services/iaService.js";
import { gerarImagem } from "./services/imageService.js";
import { getUser, createUser, updateMessageCount } from "./services/userService.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const MAX_FREE_MESSAGES = 5;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "Usuário";
  const texto = msg.text;

  if (!texto) return;

  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*!\n\n🎁 Plano gratuito: 5 mensagens de teste.\n\n🧠 IA para perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n\nApós o limite, será necessário assinar um plano.\n\nBom uso! 😄`, {
      parse_mode: "Markdown"
    });
    return;
  }

  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.replace("img ", "").trim();

    if (!prompt || prompt.length < 5) {
      await bot.sendMessage(chatId, "❗ Descreva melhor a imagem após 'img'. Exemplo:\nimg um leão com coroa");
      return;
    }

    const url = await gerarImagem(prompt);
    if (url) {
      await bot.sendPhoto(chatId, url, { caption: "🖼️ Imagem gerada com IA (DALL·E 3)" });
    } else {
      await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente outro texto.");
    }
    return;
  }

  let user = await getUser(chatId);
  if (!user) {
    user = await createUser({
      chat_id: chatId.toString(),
      nome,
      plano: 'gratis',
      mensagens: 1,
      created_at: new Date().toISOString()
    });
    const resposta = await responderIA(texto);
    return await bot.sendMessage(chatId, resposta);
  }

  const plano = user.plano;
  let mensagens = user.mensagens || 0;

  if (plano === 'gratis' && mensagens >= MAX_FREE_MESSAGES) {
    await bot.sendMessage(chatId, `⚠️ Você atingiu o limite de ${MAX_FREE_MESSAGES} mensagens gratuitas.`);
    return;
  }

  mensagens++;
  await updateMessageCount(chatId, mensagens);

  const modelo = plano === 'premium' ? 'gpt-4-turbo' : 'gpt-3.5-turbo';
  const resposta = await responderIA(texto, modelo);
  await bot.sendMessage(chatId, resposta);
});
