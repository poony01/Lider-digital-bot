// controllers/messageController.js
import { getUser, createUser, updateMessageCount } from '../services/userService.js';
import { sendChatGPTReply } from '../services/iaService.js';

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || 'Usuário';
  const text = msg.text;

  // Buscar usuário no Supabase
  let user = await getUser(chatId);

  // Criar usuário se não existir
  if (!user) {
    user = await createUser({
      chat_id: chatId.toString(),
      nome,
      plano: 'gratis',
      mensagens: 1,
      created_at: new Date().toISOString()
    });

    await bot.sendMessage(chatId, `Olá, ${nome}! Você começou a usar o assistente IA com plano gratuito. Você tem direito a ${MAX_FREE_MESSAGES} mensagens.`);
    const iaResponse = await sendChatGPTReply(text, 'gpt-3.5-turbo');
    return await bot.sendMessage(chatId, iaResponse);
  }

  // Verificar plano e quantidade de mensagens
  const plano = user.plano;
  let mensagens = user.mensagens || 0;

  if (plano === 'gratis' && mensagens >= MAX_FREE_MESSAGES) {
    return await bot.sendMessage(chatId, `Você atingiu o limite de ${MAX_FREE_MESSAGES} mensagens gratuitas.\n\nAssine o plano premium para continuar usando todos os recursos.`);
  }

  // Atualizar contagem de mensagens
  mensagens++;
  await updateMessageCount(chatId, mensagens);

  // Escolher modelo de IA conforme o plano
  const modeloIA = plano === 'premium' ? 'gpt-4-turbo' : 'gpt-3.5-turbo';

  // Resposta da IA
  const iaResponse = await sendChatGPTReply(text, modeloIA);
  await bot.sendMessage(chatId, iaResponse);
}
