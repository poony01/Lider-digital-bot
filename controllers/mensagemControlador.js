import { comandoControlador } from "./comandoControlador.js";
import { verificarOuCriarUsuario } from "../serviços/usuarioService.js";
import { enviarPlano } from "../serviços/pagamentoService.js";
import { responderIA } from "../serviços/iaService.js";
import { verificarAcesso } from "../utils/verificacaoAcesso.js";
import { processarAudio } from "../serviços/audioService.js";

export async function mensagemControlador(bot, msg) {
  const chatId = msg.chat.id;
  const nomeUsuario = msg.chat.first_name || "usuário";

  await verificarOuCriarUsuario(chatId, nomeUsuario);

  const texto = msg.text?.toLowerCase();

  if (texto === "/start") {
    await bot.sendMessage(
      chatId,
      `👋 Olá ${nomeUsuario}!\n\nSeja bem-vindo ao *Líder Digital*.\nSou um bot poderoso e posso te ajudar com:\n\n✅ Criação de imagens com IA\n✅ Criação de vídeos automáticos\n✅ Áudio para texto\n✅ Respostas inteligentes com IA\n\n🔐 Para ativar os recursos, envie: *plano*\n\nOu envie uma pergunta para começar!`
    );
    return;
  }

  if (texto === "plano" || texto === "assinatura") {
    await enviarPlano(bot, chatId);
    return;
  }

  if (msg.voice) {
    const permitido = await verificarAcesso(chatId);
    if (!permitido) {
      await bot.sendMessage(chatId, "🔒 Envie *plano* para ativar os recursos de áudio.");
      return;
    }

    await processarAudio(bot, msg);
    return;
  }

  // Redireciona para o controlador de comandos
  await comandoControlador(msg, bot);
}
