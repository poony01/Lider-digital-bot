// webhook.js
import { bot } from "./index.js";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Webhook do bot está online");

  const update = req.body;

  try {
    if (update.message) {
      const { chat, text, from } = update.message;

      // Apenas responde confirmando recebimento da mensagem
      await bot.sendMessage(chat.id, `📨 Mensagem recebida: "${text}"`);
    }

    // Ignora callbacks temporariamente
    return res.status(200).send("OK");
  } catch (e) {
    console.error("❌ Erro no webhook temporário:", e);
    return res.status(500).send("Erro no webhook temporário");
  }
};
