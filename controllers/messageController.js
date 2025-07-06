// controllers/messageController.js
import { getUser, createUser, updateMessageCount } from '../services/userService.js';
import { responderIA } from '../services/iaService.js';
import { gerarImagem } from '../services/imageService.js';

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "Usuário";
  const texto = msg.text;

  if (!texto) return;

  // Comando /start
  if (texto === "/start") {
    await bot.sendMessage(chatId,
      `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 *IA que responde perguntas*\n🖼️ *Geração de imagens com IA*\n🎙️ *Transcrição de áudios*\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\nEscolha abaixo para desbloquear acesso completo:`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔓 Assinar Plano Básico - R$14,90", callback_data: "assinar_basico" }],
            [{ text: "✨ Assinar Plano Premium - R$22,90", callback_data: "assinar_premium" }]
          ]
        }
      }
    );
    return;
  }

  // Comando de imagem: img ...
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.replace("img ", "").trim();

    if (!prompt || prompt.length < 5) {
      await bot.sendMessage(chatId, "❗ Por favor, descreva melhor a imagem. Exemplo:\n\nimg uma mulher loira em escritório moderno com fundo de cidade");
      return;
    }

    const url = await gerarImagem(prompt);
    if (url) {
      await bot.sendPhoto(chatId, url, { caption: "🖼️ Imagem gerada com IA (DALL·E 3)" });
    } else {
      await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente com outra descrição.");
    }
    return;
  }

  // Buscar ou criar usuário
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

  // Verificação de limite de mensagens
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
