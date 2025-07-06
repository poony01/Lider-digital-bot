// controllers/messageController.js
import { getUser, createUser, updateMessageCount } from '../services/userService.js';
import { responderIA } from '../services/iaService.js';
import { gerarImagem } from '../services/imageService.js';
import { gerarCobrancaPix } from '../services/pixService.js'; // 🔹 Novo para gerar cobranças

const MAX_FREE_MESSAGES = 5;

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || "Usuário";
  const texto = msg.text;

  if (!texto) return;

  // 🔹 Botões de planos
  if (texto === "/start") {
    await bot.sendMessage(chatId, 👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 *IA que responde perguntas*\n🖼️ *Geração de imagens com IA*\n🎙️ *Transcrição de áudios*\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\nEscolha uma opção abaixo para continuar com acesso ilimitado:, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🟢 Ativar Plano Básico – R$14,90", callback_data: "plano_basico" }],
          [{ text: "💎 Ativar Plano Premium – R$22,90", callback_data: "plano_premium" }]
        ]
      }
    });
    return;
  }

  // 🔹 Verificação de comando para gerar imagem com DALL·E 3
  if (texto.toLowerCase().startsWith("img ")) {
    const prompt = texto.replace("img ", "").trim();

    if (!prompt || prompt.length < 5) {
      await bot.sendMessage(chatId, "❗ Por favor, descreva melhor a imagem após o comando 'img'. Exemplo:\n\nimg um leão realista usando óculos de sol no deserto");
      return;
    }

    const url = await gerarImagem(prompt);
    if (url) {
      await bot.sendPhoto(chatId, url, { caption: 🖼️ Imagem gerada com IA (DALL·E 3) });
    } else {
      await bot.sendMessage(chatId, "❌ Não consegui gerar a imagem. Tente novamente com outra descrição.");
    }
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

MessageController
