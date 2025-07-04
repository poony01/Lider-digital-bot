import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario, buscarPlanoUsuario } from "../services/userService.js";
import { enviarPlano } from "../services/paymentService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  // Garante que o usuário existe no sistema
  await verificarOuCriarUsuario(chatId, nome);

  // Comando inicial
  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Sou o *Líder Digital Bot* 🤖\n\nVocê pode me perguntar qualquer coisa ou digitar *plano* para ver os recursos disponíveis.`);
    return;
  }

  // Enviar planos
  if (texto === "plano" || texto === "assinatura") {
    await enviarPlano(bot, chatId);
    return;
  }

  // Obter plano do usuário (básico, premium ou dono)
  const plano = await buscarPlanoUsuario(chatId);

  // Define modelo da IA com base no plano
  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";

  // Responder com IA
  if (texto) {
    const resposta = await responderIA(texto, modelo);
    await bot.sendMessage(chatId, resposta);
  }
}
