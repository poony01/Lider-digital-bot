import { bot } from "../index.js";
import { getUserOrCreate, atualizarLimite, podeUsarFuncao } from "../services/users.js";
import { processarPergunta } from "../services/openai.js";
import { gerarPix, checarPagamento } from "../services/pix.js";

export async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text ? msg.text.trim() : "";

  // Garante que usuário existe no banco
  const user = await getUserOrCreate(chatId, nome);

  if (texto === "/start") {
    await bot.sendMessage(chatId, `Olá ${nome}, bem-vindo ao Líder Digital Bot! Use /ajuda para ver comandos.`);
    return;
  }

  if (texto === "/ajuda") {
    await bot.sendMessage(chatId, `Comandos disponíveis:\n/start\n/ajuda\n/plano\n/ia (pergunta)\n/pix`);
    return;
  }

  if (texto === "/plano") {
    await bot.sendMessage(chatId, `Planos disponíveis: ...\nPara assinar, envie /pix`);
    return;
  }

  if (texto.startsWith("/ia ")) {
    if (!(await podeUsarFuncao(chatId, "ia"))) {
      await bot.sendMessage(chatId, "Você atingiu o limite do plano! Faça upgrade para continuar.");
      return;
    }
    await atualizarLimite(chatId, "ia");
    const pergunta = texto.replace("/ia ", "");
    const resposta = await processarPergunta(pergunta);
    await bot.sendMessage(chatId, resposta);
    return;
  }

  if (texto === "/pix") {
    const pix = await gerarPix(chatId);
    await bot.sendMessage(chatId, `Pague com Pix para liberar o premium:\n${pix.qrcode}`);
    return;
  }

  // ... Adicione outros comandos aqui
}
