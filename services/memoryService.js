// services/memoryService.js
import fs from "fs";
const CAMINHO_ARQUIVO = "./dados/memorias.json";

// Garante que o arquivo exista
function carregarMemoria() {
  try {
    const dados = fs.readFileSync(CAMINHO_ARQUIVO, "utf8");
    return JSON.parse(dados);
  } catch (e) {
    return {};
  }
}

function salvarMemoria(memoria) {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(memoria, null, 2));
}

export function obterHistorico(chatId) {
  const memoria = carregarMemoria();
  return memoria[chatId] || [];
}

export function adicionarAoHistorico(chatId, role, content) {
  const memoria = carregarMemoria();

  if (!memoria[chatId]) {
    memoria[chatId] = [];
  }

  memoria[chatId].push({ role, content });

  // Limita o histórico a 10 interações para não pesar
  if (memoria[chatId].length > 10) {
    memoria[chatId] = memoria[chatId].slice(-10);
  }

  salvarMemoria(memoria);
}
