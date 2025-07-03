// controllers/messageController.js
import { adminController } from "./adminController.js";
import { commandController } from "./commandController.js";
import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario } from "../services/userService.js";
import { enviarPlano } from "../services/paymentService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  // Garante que o usuário está cadastrado
  await verificarOuCriarUsuario(chatId, nome);

  // Verifica se é comando de admin
  if (await adminController(bot, msg)) return;

  // Verifica comandos personalizados
  if (await commandController(bot, msg)) return;

  // Comando /start
  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}, seja bem-vindo ao *Líder Digital Bot*! 🚀\n\nEnvie *plano* para conhecer os recursos ou escreva uma pergunta para testar minha IA.`);
    return;
  }

  // Comando plano
  if (texto === "plano" || texto === "assinatura") {
    await enviarPlano(bot, chatId);
    return;
  }

  // Caso seja uma pergunta para IA
  if (texto) {
    const resposta = await responderIA(texto);
    await bot.sendMessage(chatId, resposta);
    return;
  }

  // Resposta padrão
  await bot.sendMessage(chatId, "🤖 Ainda estou aprendendo. Envie *plano* para saber mais.");
}
