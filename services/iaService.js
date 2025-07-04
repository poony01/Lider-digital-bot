import { responderIA } from "../services/iaService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (!texto) return;

  const resposta = await responderIA(texto, "gpt-3.5-turbo");
  await bot.sendMessage(chatId, resposta);
}
