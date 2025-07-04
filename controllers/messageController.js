// controllers/messageController.js
import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario, buscarPlanoUsuario } from "../services/userService.js";
import { enviarPlano } from "../services/paymentService.js";
import { adicionarMensagem, obterContexto } from "../services/memoryService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  // Garante que o usuário existe
  await verificarOuCriarUsuario(chatId, nome);

  // Comando /start
  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Sou o *Líder Digital Bot* 🤖\n\nVocê pode me perguntar qualquer coisa ou digitar *plano* para ver os recursos disponíveis.`);
    return;
  }

  // Exibir planos
  if (texto === "plano" || texto === "assinatura") {
    await enviarPlano(bot, chatId);
    return;
  }

  // Verifica o plano do usuário
  const plano = await buscarPlanoUsuario(chatId);
  const modelo = plano === "premium" ? "gpt-4-turbo" : "gpt-3.5-turbo";

  // Responder com IA com memória
  if (texto) {
    const contexto = await obterContexto(chatId);
    const resposta = await responderIA(texto, modelo, contexto);

    await adicionarMensagem(chatId, "user", texto);
    await adicionarMensagem(chatId, "assistant", resposta);

    await bot.sendMessage(chatId, resposta);
  }
}
