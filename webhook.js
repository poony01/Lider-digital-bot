import { bot } from "./index.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = req.body;

      console.log("🔔 Webhook recebido:", JSON.stringify(body));

      if (body.message && body.message.text === "/start") {
        const chatId = body.message.chat.id;
        const nome = body.message.chat.first_name || "usuário";

        await bot.sendMessage(chatId, `Olá ${nome}, o bot está funcionando com Webhook! ✅`);
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("❌ Erro no Webhook:", error);
      res.status(500).send("Erro interno");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
