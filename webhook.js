import { bot } from "./index.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const mensagem = req.body.message;

    if (mensagem && mensagem.text === "/start") {
      const chatId = mensagem.chat.id;
      const nome = mensagem.chat.first_name || "usuário";

      await bot.sendMessage(chatId, `Olá ${nome}, o bot está funcionando com Webhook ✅`);
    }

    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
