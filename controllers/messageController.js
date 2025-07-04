// controllers/messageController.js
import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario } from "../services/userService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  // Testa integração com JSON
  try {
    verificarOuCriarUsuario(chatId, nome);
  } catch (err) {
    console.error("Erro userService:", err);
    await bot.sendMessage(chatId, "❌ Erro ao salvar usuário.");
    return;
  }

  if (texto === "/start") {
    await bot.sendMessage(chatId, `✅ Bot ativo com salvamento de usuário.`);
    return;
  }

  if (texto) {
    const resposta = await responderIA(texto);
    await bot.sendMessage(chatId, resposta);
  }
}
