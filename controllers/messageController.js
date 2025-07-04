// controllers/messageController.js
export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (texto === "/start") {
    await bot.sendMessage(chatId, `✅ Teste simples: o bot está funcionando.`);
    return;
  }

  if (texto) {
    await bot.sendMessage(chatId, `👋 Recebi sua mensagem: "${texto}"`);
  }
}
