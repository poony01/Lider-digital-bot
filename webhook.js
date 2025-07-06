// webhook.js
import { bot } from "./index.js";
import { handleMessage } from "./controllers/messageController.js";

// Função padrão exportada para o Webhook funcionar na Vercel
export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const msg = req.body.message;
      
      if (msg) {
        await handleMessage(bot, msg);
      }

      res.status(200).send("OK");
    } else {
      res.status(405).send("Method Not Allowed");
    }
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).send("Erro interno no servidor.");
  }
}
