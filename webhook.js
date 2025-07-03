import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Mensagem de boas-vindas
bot.start((ctx) => {
  ctx.reply(
    `👋 Olá, ${ctx.from.first_name}!\n\nEu sou o Líder Digital Bot. Para ver tudo que posso fazer, envie /ajuda ou toque nos botões do menu.`
  );
});

// Comando de ajuda
bot.command("ajuda", (ctx) => {
  ctx.reply(
    `🤖 *Funções disponíveis:*
- Responder perguntas com IA
- Gerar imagens
- Gerar QR Code Pix
- Transcrever áudios
- Ver planos: /plano

Envie um comando ou mensagem!`
  );
});

// Comando plano
bot.command("plano", (ctx) => {
  ctx.reply(
    `💳 *PLANOS:*
🔓 Básico: R$18,90/mês - IA, imagens simples, transcrição de áudio.
🔐 Premium: R$22,90/mês - Tudo do Básico + vídeos IA, imagens avançadas.

Para pagar, peça o Pix ou envie /assinar.`
  );
});

// Exemplo: Resposta IA (OpenAI)
bot.on("text", async (ctx) => {
  // Aqui você pode adicionar limite grátis, checar plano, etc
  if (ctx.message.text.startsWith("/")) return; // ignora comandos
  try {
    ctx.reply("🤖 Pensando...");
    // Adicione lógica real com OpenAI aqui...
    ctx.reply("Resposta IA de exemplo (integre com OpenAI aqui)");
  } catch (e) {
    ctx.reply("⚠️ Erro ao consultar IA. Tente novamente.");
  }
});

// Export para serverless (Vercel)
export default async function handler(req, res) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body, res);
    res.status(200).end();
  } else {
    res.status(200).send("Líder Digital Bot ativo!");
  }
}
