// controllers/messageController.js
import { getUser, createUser, updateMessageCount } from '../services/userService.js';
import { responderIA } from '../services/iaService.js';

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || 'Usuário';
  const texto = msg.text;

  if (!texto) return;

  // Comando /start
  if (texto === "/start") {
  const nome = msg.from.first_name || 'usuário';

  await bot.sendMessage(chatId, `👋 Olá, ${nome}!

✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.

🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar nossos recursos:

🧠 *IA que responde perguntas*
🖼️ *Geração de imagens com IA*
🎙️ *Transcrição de áudios*
🔒 *Outras funções estão bloqueadas até a ativação de um plano.*

💳 Para desbloquear o acesso completo, envie qualquer mensagem e receba o link de pagamento após atingir o limite gratuito.

Bom uso! 😄`);
  return;
}

  // Buscar usuário
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

    await bot.sendMessage(chatId, `👋 Olá, ${nome}! Você começou com o plano gratuito com até ${MAX_FREE_MESSAGES} mensagens.`);
    const respostaIA = await responderIA(texto);
    return await bot.sendMessage(chatId, respostaIA);
  }

  // Verificar limite de mensagens
  const plano = user.plano;
  let mensagens = user.mensagens || 0;

  if (plano === 'gratis' && mensagens >= MAX_FREE_MESSAGES) {
    await bot.sendMessage(chatId, `⚠️ Você atingiu o limite de ${MAX_FREE_MESSAGES} mensagens gratuitas.`);

    await bot.sendMessage(chatId, `💳 Para continuar usando o bot, escolha um dos planos abaixo:`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔓 Assinar Plano Básico - R$14,90", url: "https://pagamento.exemplo/basico" }
          ],
          [
            { text: "✨ Assinar Plano Premium - R$22,90", url: "https://pagamento.exemplo/premium" }
          ]
        ]
      }
    });

    return;
  }

  // Atualiza mensagens e responde com IA
  mensagens++;
  await updateMessageCount(chatId, mensagens);

  const modeloIA = plano === 'premium' ? 'gpt-4-turbo' : 'gpt-3.5-turbo';
  const respostaIA = await responderIA(texto, modeloIA);
  await bot.sendMessage(chatId, respostaIA);
}
