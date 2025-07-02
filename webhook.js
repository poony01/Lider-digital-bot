import { bot } from "./index.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;

    if (body.message && body.message.text === "/start") {
      const chatId = body.message.chat.id;
      const nome = body.message.chat.first_name || "usuário";

      await bot.sendMessage(chatId, `Olá ${nome}, o bot está funcionando com Webhook! ✅`);
    }

    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
