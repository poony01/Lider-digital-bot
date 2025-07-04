// services/paymentService.js
export async function enviarPlano(bot, chatId) {
  const mensagem = `💳 *Planos disponíveis*:

🔓 *Plano Básico* – R$14,90/mês
• IA com ChatGPT-3.5
• Geração de imagens simples
• Transcrição de áudios
• Suporte básico

🔐 *Plano Premium* – R$22,90/mês
• Tudo do Básico +
• IA com GPT-4-Turbo
• Geração de imagens realistas
• Criação de vídeos com IA
• Suporte prioritário

Para assinar, envie: *quero assinar*
`;
  await bot.sendMessage(chatId, mensagem, { parse_mode: "Markdown" });
}
