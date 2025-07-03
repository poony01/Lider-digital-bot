// controllers/messageController.js
export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  if (texto === "/start") {
    await bot.sendMessage(chatId, `Olá ${nome}, sou o Líder Digital Bot! 🚀`);
    return;
  }

  if (texto === "plano") {
    await bot.sendMessage(chatId, "💳 Nossos planos:\n\nBásico: R$18,90\nPremium: R$22,90\n\nPara assinar, envie: *quero assinar*");
    return;
  }

  await bot.sendMessage(chatId, "🤖 Ainda estou aprendendo. Envie *plano* para saber mais.");
}
