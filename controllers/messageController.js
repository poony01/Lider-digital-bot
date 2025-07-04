// controllers/messageController.js

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (texto === "/start") {
    await bot.sendMessage(chatId, `✅ Teste simples: o bot está funcionando.`);
    return;
  }

  await bot.sendMessage(chatId, "🛠️ Bot ativo, mas o comando não é reconhecido.");
}
