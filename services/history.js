import fs from "fs/promises";

const historyFile = "./data/history.json";

// Salva uma nova interação no histórico do usuário
export async function registrarHistorico(chatId, tipo, conteudo) {
  let history = [];
  try {
    const data = await fs.readFile(historyFile, "utf-8");
    history = JSON.parse(data);
  } catch { }
  history.push({ chatId, tipo, conteudo, data: new Date().toISOString() });
  await fs.writeFile(historyFile, JSON.stringify(history, null, 2));
}

// Recupera histórico de um usuário
export async function obterHistorico(chatId) {
  try {
    const data = await fs.readFile(historyFile, "utf-8");
    const history = JSON.parse(data);
    return history.filter((h) => h.chatId === chatId);
  } catch {
    return [];
  }
}
