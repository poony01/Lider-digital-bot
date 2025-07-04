// controllers/messageController.js
import { responderIA } from "../services/iaService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (texto === "/start") {
    await bot.sendMessage(chatId, `✅ Bot funcionando com IA: envie qualquer texto.`);
    return;
  }

  if (texto) {
    try {
      const resposta = await responderIA(texto);
      await bot.sendMessage(chatId, resposta);
    } catch (erro) {
      console.error("Erro na IA:", erro);
      await bot.sendMessage(chatId, "❌ Erro ao responder com IA.");
    }
  }
}
