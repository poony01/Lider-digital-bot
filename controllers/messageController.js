// Lida com mensagens comuns dos usuários (IA, voz, etc)
export async function handleMessage(message, chatId, userId) {
  // Aqui você vai integrar com o ChatGPT, checar limites, etc
  // Exemplo de resposta simples:
  // Envie para o Telegram usando sua função utilitária de envio
  console.log(`Recebida mensagem de ${userId}: ${message.text}`);
  // TODO: Implementar lógica de IA, limites, planos, etc
}
