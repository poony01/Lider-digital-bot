// controllers/messageController.js
import { getUser, createUser, updateMessageCount } from "../services/userService.js";
import { responderIA } from "../services/iaService.js";

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || 'usuário';
  const texto = msg.text?.toLowerCase();

  // Mensagem de boas-vindas
  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá, ${nome}!

✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.

🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar nossos recursos:

🧠 *IA que responde perguntas*
🖼️ *Geração de imagens com IA*
🎙️ *Transcrição de áudios*

💳 Após atingir o limite, será necessário ativar um plano.

Bom uso! 😄`, { parse_mode: "Markdown" });
    return;
  }

  // Buscar usuário no banco
  let user = await getUser(chatId);

  // Criar usuário novo
  if (!user) {
    user = await createUser({
      chat_id: chatId.toString(),
      nome,
      plano: "gratis",
      mensagens: 1,
      created_at: new Date().toISOString()
    });

    const resposta = await responderIA(texto);
    await bot.sendMessage(chatId, resposta);
    return;
  }

  const plano = user.plano;
  let mensagens = user.mensagens || 0;

  // Verificar limite gratuito
  if (plano === "gratis" && mensagens >= MAX_FREE_MESSAGES) {
    await bot.sendMessage(chatId, `⚠️ Você atingiu o limite de *${MAX_FREE_MESSAGES} mensagens gratuitas*.

Para continuar usando todos os recursos, ative o *Plano Premium* por apenas *R$22,90/mês*.`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          {
            text: "💳 Ativar Plano Premium",
            url: "https://seulinkpagamentoaqui.com" // Substitua pelo link real
          }
        ]]
      }
    });
    return;
  }

  // Atualiza número de mensagens
  mensagens++;
  await updateMessageCount(chatId, mensagens);

  // Define o modelo da IA
  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";

  // IA responde
  const resposta = await responderIA(texto, modelo);
  await bot.sendMessage(chatId, resposta);
}
