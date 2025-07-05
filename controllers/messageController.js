// controllers/messageController.js
export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (texto === "/start") {
    await bot.sendMessage(chatId, "✅ Bot funcionando. Webhook ativo.");
    return;
  }

  await bot.sendMessage(chatId, `📩 Você disse: ${texto}`);
}
