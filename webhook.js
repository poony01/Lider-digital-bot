// webhook.js
import { bot } from "./index.js";
import { handleMessage } from "./controllers/messageController.js";
import { handleCommand } from "./controllers/commandController.js";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const msg = req.body.message;

      if (!msg || !msg.text) {
        return res.status(200).send("Sem mensagem de texto");
      }

      const texto = msg.text.trim();

      if (texto.startsWith("/")) {
        await handleCommand(bot, msg); // Comando
      } else {
        await handleMessage(bot, msg); // Mensagem comum
      }

      return res.status(200).send("OK");
    } else {
      return res.status(405).send("Method Not Allowed");
    }
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return res.status(500).send("Erro interno no servidor");
  }
}
