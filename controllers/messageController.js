import { getUser, createUser, updateMessageCount } from '../services/userService.js';
import { responderIA } from '../services/iaService.js';

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "Usuário";
  const texto = msg.text;

  if (!texto) return;

  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 *IA que responde perguntas*\n🖼️ *Geração de imagens com IA*\n🎙️ *Transcrição de áudios*\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\nBom uso! 😄`, { parse_mode: "Markdown" });
    return;
  }

  let user = await getUser(chatId);
  if (!user) {
    user = await createUser({
      chat_id: chatId.toString(),
      nome,
      plano: 'gratis',
      mensagens: 1,
      created_at: new Date().toISOString()
    });
    const respostaIA = await responderIA(texto);
    return await bot.sendMessage(chatId, respostaIA);
  }

  const plano = user.plano;
  let mensagens = user.mensagens || 0;

  if (plano === 'gratis' && mensagens >= MAX_FREE_MESSAGES) {
    await bot.sendMessage(chatId, `⚠️ Você atingiu o limite de ${MAX_FREE_MESSAGES} mensagens gratuitas.`);
    return;
  }

  mensagens++;
  await updateMessageCount(chatId, mensagens);

  const modelo = plano === 'premium' ? 'gpt-4-turbo' : 'gpt-3.5-turbo';
  const respostaIA = await responderIA(texto, modelo);
  await bot.sendMessage(chatId, respostaIA);
}
