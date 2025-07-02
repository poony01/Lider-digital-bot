// Webhook handler para integração do bot com a Vercel (e Telegram)

import bot from "./index.js";
import comandoControlador from "./controladores/comandoControlador.js";

// Função padrão Vercel: lida com POST do Telegram
export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Método não permitido");
    return;
  }

  const body = req.body;

  // Verifica se é mensagem de texto de usuário
  if (body && body.message) {
    const ctx = {
      message: body.message,
      reply: (msg) => bot.sendMessage(body.message.chat.id, msg)
    };

    const text = body.message.text || "";

    // Roteamento simples de comandos
    if (text.startsWith("/start")) {
      await comandoControlador.start(ctx);
    } else if (text.startsWith("/plano")) {
      await comandoControlador.plano(ctx);
    } else if (text.startsWith("/ajuda")) {
      await comandoControlador.ajuda(ctx);
    } else {
      await ctx.reply("Comando não reconhecido. Use /ajuda para ver as opções.");
    }
  }

  res.status(200).send("OK");
};
