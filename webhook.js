// webhook.js
import { bot } from "./index.js";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot ativo");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const nome = from.first_name || "usuário";

      // Responde ao comando /start
      if (text === "/start") {
        await bot.sendMessage(chat.id, `👋 Olá, ${nome}!\n\n🤖 O bot está funcionando normalmente.\n\nEnvie uma pergunta ou use um comando.`, {
          parse_mode: "Markdown"
        });
        return res.end();
      }

      // Comando /limpar
      if (text === "/limpar") {
        await bot.sendMessage(chat.id, "🧹 Memória limpa com sucesso!", {
          parse_mode: "Markdown"
        });
        return res.end();
      }

      // Resposta padrão
      await bot.sendMessage(chat.id, "🤖 Comando não reconhecido.", {
        parse_mode: "Markdown"
      });
      return res.end();
    }

    return res.end();

  } catch (e) {
    console.error("Erro no webhook:", e);
    const chatId = update.message?.chat?.id;
    if (chatId) {
      await bot.sendMessage(chatId, `❌ Erro:\n\`${e.message}\``, {
        parse_mode: "Markdown"
      });
    }
    return res.status(500).send("Erro interno");
  }
};
