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

bot.setMyCommands([
  { command: "start", description: "🚀 Iniciar o bot" },
  { command: "limpar", description: "🧹 Limpar histórico" },
  { command: "convidar", description: "👥 Ver meu link de convite" },
  { command: "meusganhos", description: "💸 Ver meus ganhos" },
  { command: "usuarios", description: "📋 Ver todos os usuários" },
  { command: "zera", description: "♻️ Zerar meus ganhos" },
]);

bot.on("message", async (msg) => {
  const { text, chat, from } = msg;
  const userId = from.id;
  const nome = from.first_name || "usuário";

  if (text?.startsWith("/start")) {
    const indicadoPor = Number(text.split(" ")[1]);
    if (indicadoPor && indicadoPor !== userId) {
      await salvarConvite(userId, indicadoPor);
    }

    const mensagem = `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n🎬 Geração de vídeos\n\n🗂️ Após atingir o limite, será necessário ativar um plano.`;

    return await bot.sendMessage(chat.id, mensagem, { parse_mode: "Markdown" });
  }

  if (text === "/usuarios" && userId === OWNER_ID) {
    return await listarUsuarios(bot, chat.id);
  }

  if (text === "/meusganhos") {
    return await obterAfiliado(userId, bot, chat.id);
  }

  if (text === "/zera") {
    return await zerarSaldo(userId, bot, chat.id);
  }

  if (text === "/convidar") {
    return await bot.sendMessage(chat.id, `🔗 Seu link de convite:\nhttps://t.me/LiderDigital_bot?start=${userId}`);
  }

  if (text === "/limpar") {
    return await bot.sendMessage(chat.id, "🧹 Histórico apagado com sucesso!");
  }

  if (text && !text.startsWith("/")) {
    await bot.sendChatAction(chat.id, "typing");
    const resposta = await askGPT(text, "gpt-3.5-turbo", chat.id);
    return await bot.sendMessage(chat.id, `🤖 ${resposta}`);
  }
});

bot.on("callback_query", async (callbackQuery) => {
  await tratarCallbackQuery(bot, callbackQuery);
});
