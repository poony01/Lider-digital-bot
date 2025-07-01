import bot from "./commandController.js";

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text;

  // Exemplo de resposta simples
  bot.sendMessage(chatId, `Você disse: ${texto}`);
});
