// webhook.js (na raiz)
import { bot } from "./index.js";
import { handleMessage } from "./controllers/messageController.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";

// Exporta a função HTTP exigida pela Vercel
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("🤖 Webhook do bot está online.");
  }

  try {
    const body = req.body;

    if (body.message) {
      await handleMessage(bot, body.message);
    } else if (body.callback_query) {
      await tratarCallbackQuery(bot, body.callback_query);
    }

    return res.status(200).send("✅ Mensagem recebida com sucesso.");
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return res.status(500).send("Erro interno no webhook");
  }
}
