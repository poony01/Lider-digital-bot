// services/memoryService.js

const historicoUsuarios = new Map();

export function obterHistorico(chatId) {
  return historicoUsuarios.get(chatId) || [];
}

export function adicionarAoHistorico(chatId, mensagem) {
  const historico = historicoUsuarios.get(chatId) || [];
  historico.push(mensagem);
  historicoUsuarios.set(chatId, historico.slice(-10)); // guarda as últimas 10 mensagens
}
