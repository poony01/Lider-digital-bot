// index.js
import express from "express";
import { Bot } from "grammy";
import dotenv from "dotenv";
import { responderIA } from "./services/iaService.js";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

// Mensagem inicial
bot.command("start", async (ctx) => {
  await ctx.reply(
    `👋 Olá, ${ctx.from.first_name}!\n\n✅ Seja bem-vindo(a) ao Líder Digital Bot, sua assistente com inteligência artificial.\n\n🎁 Você está no plano gratuito, com direito a 5 mensagens para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\nBom uso! 😄`
  );
});

// Resposta IA
bot.on("message:text", async (ctx) => {
  const pergunta = ctx.message.text;
  const resposta = await responderIA(pergunta, "gpt-3.5-turbo", ctx.chat.id);
  await ctx.reply(resposta);
});

// Webhook
const app = express();
app.use(express.json());

app.post(`/webhook/${process.env.BOT_TOKEN}`, async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.send("ok");
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});

export default app;
