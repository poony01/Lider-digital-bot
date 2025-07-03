import { bot } from "../index.js";

// Aqui no futuro você pode importar outros services:
// import { getUserOrCreate, atualizarLimite, podeUsarFuncao } from "../services/users.js";
// import { processarPergunta } from "../services/openai.js";
// import { gerarPix } from "../services/pix.js";

export async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const nome = msg.chat.first_name || "usuário";
  const texto = msg.text ? msg.text.trim() : "";

  // Comando /start
  if (texto === "/start") {
    await bot.sendMessage(
      chatId,
      `Olá ${nome}, bem-vindo ao Líder Digital Bot! Use /ajuda para ver os comandos disponíveis.`
    );
    return;
  }

  // Comando /ajuda
  if (texto === "/ajuda") {
    await bot.sendMessage(
      chatId,
      `Comandos disponíveis:\n/start - Iniciar\n/ajuda - Ver ajuda\n/plano - Ver planos\n/pix - Gerar Pix`
    );
    return;
  }

  // Comando /plano
  if (texto === "/plano") {
    await bot.sendMessage(
      chatId,
      `Planos disponíveis:\n- Grátis: 5 perguntas IA por dia\n- Premium: ilimitado\nPara assinar, envie /pix`
    );
    return;
  }

  // Comando /pix
  if (texto === "/pix") {
    await bot.sendMessage(
      chatId,
      `Para fazer upgrade para o premium, envie um Pix para a chave: SEU_PIX@EMAIL.COM\n(Em breve: Pix automático!)`
    );
    return;
  }

  // Mensagem padrão para comandos não reconhecidos
  await bot.sendMessage(
    chatId,
    "Comando não reconhecido. Use /ajuda para ver os comandos disponíveis."
  );
}
