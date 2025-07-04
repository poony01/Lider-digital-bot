import { responderIA } from "../services/iaService.js";
import { getUser, createUser, updateMessageCount } from "../services/userService.js";

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "Usuário";
  const texto = msg.text?.toLowerCase();

  if (!texto) return;

  // Verifica usuário
  let user = await getUser(chatId);
  if (!user) {
    user = await createUser({
      chat_id: chatId.toString(),
      nome,
      plano: "gratis",
      mensagens: 1,
      created_at: new Date().toISOString()
    });

    await bot.sendMessage(chatId, `👋 Olá ${nome}, bem-vindo ao Líder Digital Bot! Você está no plano gratuito com ${MAX_FREE_MESSAGES} mensagens.`);

    const resposta = await responderIA(texto, "gpt-3.5-turbo");
    return await bot.sendMessage(chatId, resposta);
  }

  const plano = user.plano || "gratis";
  let mensagens = user.mensagens || 0;

  if (plano === "gratis" && mensagens >= MAX_FREE_MESSAGES) {
    return await bot.sendMessage(chatId, `⚠️ Você atingiu o limite de ${MAX_FREE_MESSAGES} mensagens gratuitas.\n\nAssine o plano premium para continuar usando a IA.`);
  }

  mensagens++;
  await updateMessageCount(chatId, mensagens);

  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";

  const resposta = await responderIA(texto, modelo);
  await bot.sendMessage(chatId, resposta);
}
