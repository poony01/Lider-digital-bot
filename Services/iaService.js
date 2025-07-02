// serviços/iaService.js

import { verificarAcesso } from "../utils/verificarAcesso.js";
import { responderTexto } from "./openaiService.js";

export async function processarIA(ctx) {
  const mensagem = ctx.message?.text;
  const userId = ctx.from.id;

  const permitido = await verificarAcesso(userId);
  if (!permitido) {
    return ctx.reply(
      "🔒 Para usar essa função, você precisa ter um plano ativo. Envie: assinatura"
    );
  }

  if (!mensagem || mensagem.length < 3) {
    return ctx.reply("❌ Escreva sua dúvida ou comando para a IA.");
  }

  try {
    const resposta = await responderTexto(mensagem);
    ctx.reply(resposta);
  } catch (error) {
    console.error("Erro ao gerar resposta da IA:", error);
    ctx.reply("❌ Erro ao gerar resposta. Tente novamente mais tarde.");
  }
}
