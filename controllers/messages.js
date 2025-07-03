import { bot } from "../index.js";

export async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";

  if (msg.text === "/start") {
    await bot.sendMessage(chatId, `Olá ${nome}, bem-vindo ao Líder Digital Bot! Use /ajuda para ver comandos.`);
    return;
  }

  if (msg.text === "/ajuda") {
    await bot.sendMessage(chatId, `Comandos disponíveis:\n/start\n/ajuda\n/plano`);
    return;
  }

  // Adicione aqui o tratamento de mais comandos
}
