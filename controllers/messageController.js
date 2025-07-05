// controllers/messageController.js
import { getUser, createUser, updateMessageCount } from '../services/userService.js';
import { responderIA } from '../services/iaService.js';

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || 'Usuário';
  const texto = msg.text?.toLowerCase();

  if (!texto) return;

  // Verifica se usuário existe no Supabase
  let user = await getUser(chatId);

  if (!user) {
    user = await createUser({
      chat_id: chatId.toString(),
      nome,
      plano: "gratis",
      mensagens: 1,
      created_at: new Date().toISOString()
    });

    await bot.sendMessage(chatId, `👋 Olá, ${nome}! Você começou no plano gratuito com até ${MAX_FREE_MESSAGES} mensagens.`);
    const resposta = await responderIA(texto, "gpt-3.5-turbo");
    return await bot.sendMessage(chatId, resposta);
  }

  const plano = user.plano;
  let mensagens = user.mensagens || 0;

  if (plano === "gratis" && mensagens >= MAX_FREE_MESSAGES) {
    return await bot.sendMessage(chatId, `🚫 Você usou suas ${MAX_FREE_MESSAGES} mensagens grátis. Assine o plano premium para continuar.`);
  }

  mensagens++;
  await updateMessageCount(chatId, mensagens);

  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";
  const resposta = await responderIA(texto, modelo);

  await bot.sendMessage(chatId, resposta);
}
