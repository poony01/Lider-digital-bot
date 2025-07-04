// services/memoryService.js
const memoria = {};

export async function obterHistorico(chatId) {
  return memoria[chatId] || [
    { role: "system", content: "Você é um assistente útil e amigável." }
  ];
}

export async function adicionarMensagem(chatId, mensagens) {
  memoria[chatId] = mensagens.slice(-10); // mantém apenas as 10 últimas mensagens
}
