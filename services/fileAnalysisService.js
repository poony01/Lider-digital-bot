// services/fileAnalysisService.js

export async function analisarArquivo(bot, msg) {
  const chatId = msg.chat.id;

  if (msg.photo || msg.video || msg.document) {
    await bot.sendMessage(chatId, "📁 Recebi seu arquivo! Em breve vou conseguir analisá-lo com IA.");
    return true;
  }

  return false;
}
