// controllers/messageController.js
import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario, buscarPlanoUsuario, registrarMensagem } from "../services/userService.js";
import { enviarPlano } from "../services/paymentService.js";
import { obterHistorico, adicionarMensagem } from "../services/memoryService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  if (!texto) return;

  // 1. Garante que o usuário existe no sistema
  await verificarOuCriarUsuario(chatId, nome);

  // 2. Comando inicial
  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Sou o *Líder Digital Bot* 🤖\n\nVocê pode me perguntar qualquer coisa ou digitar *plano* para ver os recursos.`);
    return;
  }

  // 3. Mostrar planos
  if (texto === "plano" || texto === "assinatura") {
    await enviarPlano(bot, chatId);
    return;
  }

  // 4. Verifica plano e número de mensagens
  const plano = await buscarPlanoUsuario(chatId);
  const permitido = plano === "premium" || plano === "dono";
  const modelo = permitido ? "gpt-4-turbo" : "gpt-3.5-turbo";

  const permitidoUsar = await registrarMensagem(chatId); // controla limite de 5 mensagens grátis

  if (!permitido && !permitidoUsar) {
    await bot.sendMessage(chatId, `🚫 Você usou todas as mensagens gratuitas.\n\nAssine um plano para continuar usando:\nDigite *plano* para ver as opções.`);
    return;
  }

  // 5. Recupera memória da conversa do usuário
  const historico = await obterHistorico(chatId);

  // 6. Adiciona nova mensagem do usuário
  historico.push({ role: "user", content: texto });

  // 7. Chama a IA
  const resposta = await responderIA(historico, modelo);

  // 8. Salva a resposta na memória
  historico.push({ role: "assistant", content: resposta });
  await adicionarMensagem(chatId, historico);

  // 9. Envia resposta
  await bot.sendMessage(chatId, resposta);
}
