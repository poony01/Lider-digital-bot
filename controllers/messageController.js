// controllers/messageController.js
import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario, buscarPlanoUsuario, contarMensagens } from "../services/userService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  // Cadastra usuário
  verificarOuCriarUsuario(chatId, nome);

  // /start
  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Digite uma pergunta ou envie "plano" para ver as opções.`);
    return;
  }

  // Ver planos
  if (texto === "plano" || texto === "assinatura") {
    await bot.sendMessage(chatId, `💳 Planos disponíveis:

🔓 *Básico – R$14,90/mês*
• IA com GPT-3.5
• Geração de imagem simples
• Transcrição de áudios
• Suporte básico

🔐 *Premium – R$22,90/mês*
• Tudo do básico +
• IA com GPT-4 Turbo
• Geração de vídeos com IA
• Imagens realistas
• Suporte prioritário`);
    return;
  }

  // Contar mensagem
  contarMensagens(chatId);

  // Ver plano
  const plano = buscarPlanoUsuario(chatId);
  const modelo = plano === "premium" || plano === "dono" ? "gpt-4-turbo" : "gpt-3.5-turbo";

  // IA responde
  if (texto) {
    const resposta = await responderIA(texto, modelo);
    await bot.sendMessage(chatId, resposta);
  }
}
