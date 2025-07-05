// webhook.js
import { bot } from "./index.js";
import { handleMessage } from "./controllers/messageController.js";
import { handleCommand } from "./controllers/commandController.js";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const msg = req.body.message;

      if (msg) {
        const texto = msg.text?.trim();

        // Se for comando, trata no commandController
        if (texto && texto.startsWith("/")) {
          await handleCommand(bot, msg);
        } else {
          await handleMessage(bot, msg);
        }
      }

      res.status(200).send("OK");
    } else {
      res.status(405).send("Method Not Allowed");
    }
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    res.status(500).send("Erro interno no servidor.");
  }
}
