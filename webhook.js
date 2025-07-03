import { bot } from "./index.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const msg = req.body.message;
    if (msg?.text === "/start") {
      const chatId = msg.chat.id;
      const nome = msg.chat.first_name || "usuário";
      await bot.sendMessage(chatId, `Olá ${nome}, o bot está funcionando com Webhook ✅`);
    }
    return res.status(200).send("ok");
  }

  return res.status(405).send("Method Not Allowed");
}
