import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario, buscarPlanoUsuario } from "../services/userService.js";
import { enviarPlano } from "../services/paymentService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  if (!texto) return;

  await verificarOuCriarUsuario(chatId, nome);

  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Envie *plano* para ver os recursos ou escreva algo para a IA.`);
    return;
  }

  if (texto === "plano") {
    await enviarPlano(bot, chatId);
    return;
  }

  const plano = await buscarPlanoUsuario(chatId);
  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";

  const resposta = await responderIA(texto, modelo);
  await bot.sendMessage(chatId, resposta);
}
