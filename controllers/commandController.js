// Lida com comandos normais (ex: /start, /plano, /minha assinatura, etc)
export async function handleCommand(text, chatId, userId) {
  // Exemplo: switch/case para cada comando
  switch (text.split(' ')[0]) {
    case '/start':
      // TODO: enviar mensagem de boas-vindas
      break;
    case '/plano':
      // TODO: mostrar opções de plano
      break;
    case '/minha':
      // TODO: mostrar status da assinatura
      break;
    case '/mensagens':
      // TODO: mostrar quantidade de mensagens restantes
      break;
    default:
      // TODO: comando desconhecido
      break;
  }
}
