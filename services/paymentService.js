// services/paymentService.js
export async function enviarPlano(bot, chatId) {
  const texto = `
💳 *Planos Disponíveis:*

🔓 *Plano Básico* – R$14,90/mês
• Respostas por IA (ChatGPT 3.5)
• Geração de imagens simples
• Transcrição de áudios
• Suporte básico

🔐 *Plano Premium* – R$22,90/mês
• Tudo do Básico +
• Geração de vídeos com IA
• Imagens realistas avançadas
• Respostas mais longas
• Suporte prioritário
• IA GPT-4 Turbo 🤖

Para assinar, envie: *quero assinar*

Aceitamos pagamento via *Pix* com verificação automática ✅
  `.trim();

  await bot.sendMessage(chatId, texto, { parse_mode: "Markdown" });
}
