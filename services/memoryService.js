// services/memoryService.js
const historicos = {};

export function obterHistorico(chatId) {
  if (!historicos[chatId]) {
    historicos[chatId] = [];
  }
  return historicos[chatId];
}

export function adicionarAoHistorico(chatId, mensagem) {
  if (!historicos[chatId]) {
    historicos[chatId] = [];
  }
  historicos[chatId].push(mensagem);

  if (historicos[chatId].length > 10) {
    historicos[chatId].shift();
  }
}
