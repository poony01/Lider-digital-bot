import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marcarComoAssinante } from "./userService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usuariosPath = path.join(__dirname, "../dados/usuarios.json");

export async function enviarPlano(bot, chatId) {
  const mensagem = `
💳 *Planos Disponíveis*

🔓 *Plano Básico – R$18,90*
• IA (respostas inteligentes)
• Transcrição de áudios
• Geração de imagens simples

🔐 *Plano Premium – R$22,90*
• Tudo do Básico +
• Geração de vídeos com IA
• Imagens realistas avançadas
• Suporte prioritário

Para simular o pagamento, envie: *quero assinar básico* ou *quero assinar premium*
  `;

  await bot.sendMessage(chatId, mensagem, { parse_mode: "Markdown" });
}

export async function simularPagamento(bot, chatId, tipoPlano) {
  const plano = tipoPlano.toLowerCase();
  const valido = plano === "básico" || plano === "premium";

  if (!valido) {
    await bot.sendMessage(chatId, "❌ Plano inválido. Envie *quero assinar básico* ou *quero assinar premium*.");
    return;
  }

  await marcarComoAssinante(chatId);

  await bot.sendMessage(chatId, `✅ Pagamento simulado com sucesso!\nVocê agora é assinante do plano *${plano}*!`, {
    parse_mode: "Markdown",
  });
}
