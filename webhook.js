// webhook.js
import express from "express";
import { config } from "dotenv";
import { handleCommand } from "./controllers/commandController.js";
import { handleMessage } from "./controllers/messageController.js";

config(); // para desenvolvimento local — na Vercel pode ser removido se quiser

const app = express();
app.use(express.json());

app.post(`/webhook/${process.env.BOT_TOKEN}`, async (req, res) => {
  const body = req.body;

  try {
    // Verifica se é mensagem
    if (body?.message) {
      const msg = body.message;

      // Se for comando (ex: /start, /planos)
      if (msg.text?.startsWith("/")) {
        await handleCommand(msg);
      } else {
        // Caso contrário, trata como mensagem normal (ex: pergunta para IA)
        await handleMessage(msg);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});

export default app;
