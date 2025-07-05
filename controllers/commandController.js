// controllers/commandController.js
import { getUser, updatePixKey } from "../services/userService.js";
import { enviarMensagem } from "../services/telegramService.js";
import { responderIA } from "../services/iaService.js";

export async function processarComando(message) {
  const chatId = message.chat.id;
  const texto = message.text?.trim();
  const user = getUser(chatId);

  if (texto === "/start") {
    await enviarMensagem(chatId, "🤖 Olá! Bem-vindo ao assistente IA. Digite sua pergunta ou use os comandos abaixo.");
  }

  else if (texto === "/convidar") {
    const link = `https://t.me/LiderDigitalBot?start=${chatId}`;
    await enviarMensagem(chatId, `💸 Convide amigos e ganhe 50%!\n\nSeu link exclusivo:\n${link}\n\nVocê poderá sacar a partir de R$20 via Pix.`);
  }

  else if (texto === "/saldo") {
    await enviarMensagem(chatId, `💰 Seu saldo: R$${user.saldo.toFixed(2)}\n👥 Indicados: ${user.indicados.length}`);
  }

  else if (texto.startsWith("/pixminhachave")) {
    const partes = texto.split(" ");
    if (partes.length >= 2) {
      const chavePix = partes.slice(1).join(" ").trim();
      updatePixKey(chatId, chavePix);
      await enviarMensagem(chatId, "✅ Sua chave Pix foi atualizada com sucesso.");
    } else {
      await enviarMensagem(chatId, "❌ Envie no formato:\n/pixminhachave SUA_CHAVE_PIX");
    }
  }

  else {
    // Se for outra coisa, trata como pergunta à IA
    const resposta = await responderIA(texto, "gpt-3.5-turbo", chatId);
    await enviarMensagem(chatId, resposta);
  }
}
