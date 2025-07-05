import { Bot } from "grammy";
import { responderIA } from "./services/iaService.js";

const bot = new Bot(process.env.BOT_TOKEN);

// Mensagem de boas-vindas
bot.command("start", async (ctx) => {
  const nome = ctx.from.first_name || "usuário";
  await ctx.reply(
    `👋 Olá, ${nome}!\n\n` +
    `✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n` +
    `🎁 Você está no plano gratuito, com direito a 5 mensagens para testar nossos recursos:\n\n` +
    `🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n\n` +
    `💳 Após atingir o limite, será necessário ativar um plano.\n\nBom uso! 😄`,
    { parse_mode: "Markdown" }
  );
});

// IA responde perguntas
bot.on("message:text", async (ctx) => {
  const pergunta = ctx.message.text;
  const resposta = await responderIA(pergunta, "gpt-3.5-turbo", ctx.chat.id);
  await ctx.reply(resposta);
});

export default bot;
