// controllers/messageController.js
import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario, buscarPlanoUsuario } from "../services/userService.js";
import { enviarPlano } from "../services/paymentService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  try {
    // Garante que o usuário existe
    await verificarOuCriarUsuario(chatId, nome);
  } catch (err) {
    console.error("Erro ao verificar/criar usuário:", err);
    await bot.sendMessage(chatId, "⚠️ Erro ao registrar seu usuário. Tente novamente mais tarde.");
    return;
  }

  // Comando /start
  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Sou o *Líder Digital Bot* 🤖\n\nVocê pode me perguntar qualquer coisa ou digitar *plano* para ver os recursos disponíveis.`);
    return;
  }

  // Mostrar planos
  if (texto === "plano" || texto === "assinatura") {
    try {
      await enviarPlano(bot, chatId);
    } catch (err) {
      console.error("Erro ao enviar plano:", err);
      await bot.sendMessage(chatId, "⚠️ Não foi possível mostrar os planos agora.");
    }
    return;
  }

  // Verifica o plano do usuário
  let modelo = "gpt-3.5-turbo";
  try {
    const plano = await buscarPlanoUsuario(chatId);
    if (plano === "premium") modelo = "gpt-4-turbo";
  } catch (err) {
    console.warn("Erro ao buscar plano. Usando gpt-3.5 padrão.", err);
  }

  // Envia pergunta para IA
  if (texto) {
    const resposta = await responderIA(texto, modelo);
    await bot.sendMessage(chatId, resposta);
  }
}
