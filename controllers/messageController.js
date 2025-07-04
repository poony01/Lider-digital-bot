// controllers/messageController.js
import { responderIA } from "../services/iaService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (texto === "/start") {
    await bot.sendMessage(chatId, `✅ Bot ativo. Webhook funcionando. Envie qualquer pergunta para testar a IA.`);
    return;
  }

  if (texto) {
    const resposta = await responderIA(texto);
    await bot.sendMessage(chatId, resposta);
  }
}
