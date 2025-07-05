// controllers/messageController.js
import { getUser, createUser, updateMessageCount } from "../services/userService.js";
import { responderIA } from "../services/iaService.js";

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "Usuário";
  const texto = msg.text?.toLowerCase();

  if (!texto) return;

  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Sou o *Líder Digital Bot*.\nVocê pode me perguntar qualquer coisa ou digitar *plano* para ver as opções.`);
    return;
  }

  // Buscar usuário
  let user = await getUser(chatId);

  // Se não existir, cria
  if (!user) {
    user = await createUser({
      chat_id: chatId.toString(),
      nome,
      plano: "gratis",
      mensagens: 1,
      created_at: new Date().toISOString(),
    });

    await bot.sendMessage(chatId, `🎉 Você começou no plano gratuito com ${MAX_FREE_MESSAGES} mensagens. Aproveite!`);
  } else {
    if (user.plano === "gratis" && user.mensagens >= MAX_FREE_MESSAGES) {
      await bot.sendMessage(chatId, `🚫 Você usou as ${MAX_FREE_MESSAGES} mensagens gratuitas.\nAssine o plano premium para continuar.`);
      return;
    }

    // Atualiza contador
    await updateMessageCount(chatId, user.mensagens + 1);
  }

  // IA responde com modelo conforme plano
  const modelo = user.plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";
  const resposta = await responderIA(texto, modelo);

  await bot.sendMessage(chatId, resposta);
}
