import { bot } from "./index.js";
const OWNER_ID = Number(process.env.OWNER_ID);

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot ativo");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const userId = from.id;
      const nome = from.first_name || "usuário";

      if (text === "/start") {
        return await bot.sendMessage(chat.id, `👋 Olá, ${nome}! Bot ativo para você.`, {
          parse_mode: "Markdown"
        });
      }

      if (text === "/limpar") {
        return await bot.sendMessage(chat.id, "🧹 Memória limpa com sucesso!", {
          parse_mode: "Markdown"
        });
      }

      return await bot.sendMessage(chat.id, "🤖 Comando não reconhecido.");
    }

  } catch (e) {
    console.error("Erro:", e);
    const chatId = update.message?.chat?.id;
    if (chatId) {
      await bot.sendMessage(chatId, `❌ Erro:\n${e.message}`);
    }
    return res.status(500).send("Erro interno");
  }

  res.status(200).send("OK");
};
