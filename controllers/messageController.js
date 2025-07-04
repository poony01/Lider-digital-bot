// controllers/messageController.js
import { responderIA } from "../services/iaService.js";
import { verificarOuCriarUsuario, buscarPlanoUsuario, registrarMensagem } from "../services/userService.js";
import { enviarPlano } from "../services/paymentService.js";
import { analisarArquivo } from "../services/fileAnalysisService.js";
import { obterHistorico, adicionarMensagem } from "../services/memoryService.js";

export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text?.toLowerCase();

  await verificarOuCriarUsuario(chatId, nome);

  // Analisa arquivos enviados
  if (await analisarArquivo(bot, msg)) return;

  if (texto === "/start") {
    await bot.sendMessage(chatId, `👋 Olá ${nome}! Sou o *Líder Digital Bot* 🤖\n\nVocê pode me perguntar qualquer coisa ou digitar *plano* para ver os recursos disponíveis.`, { parse_mode: "Markdown" });
    return;
  }

  if (texto === "plano" || texto === "assinatura") {
    await enviarPlano(bot, chatId);
    return;
  }

  const plano = await buscarPlanoUsuario(chatId);

  if (plano === "gratis") {
    const permitido = await registrarMensagem(chatId);
    if (!permitido) {
      await bot.sendMessage(chatId, "⚠️ Você atingiu o limite gratuito. Digite *plano* para assinar e continuar usando o bot.");
      return;
    }
  }

  // Memória de conversa
  const historico = await obterHistorico(chatId);
  historico.push({ role: "user", content: texto });

  const modelo = plano === "premium" || plano === "dono" ? "gpt-4-turbo" : "gpt-3.5-turbo";

  const resposta = await responderIA(historico, modelo);
  historico.push({ role: "assistant", content: resposta });

  await adicionarMensagem(chatId, historico);
  await bot.sendMessage(chatId, resposta);
}
