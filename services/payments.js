import fs from "fs/promises";

const paymentsFile = "./data/pagamentos.json";

// Registra pagamento
export async function registrarPagamento(chatId, valor, status = "pendente") {
  let pagamentos = [];
  try {
    const data = await fs.readFile(paymentsFile, "utf-8");
    pagamentos = JSON.parse(data);
  } catch { }
  pagamentos.push({ chatId, valor, status, data: new Date().toISOString() });
  await fs.writeFile(paymentsFile, JSON.stringify(pagamentos, null, 2));
}

// Checa pagamentos de um usuário
export async function checarPagamentoUsuario(chatId) {
  try {
    const data = await fs.readFile(paymentsFile, "utf-8");
    const pagamentos = JSON.parse(data);
    return pagamentos.filter((p) => p.chatId === chatId);
  } catch {
    return [];
  }
}
