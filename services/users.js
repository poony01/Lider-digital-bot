import fs from "fs/promises";

const usersFile = "./data/users.json";

// Busca usuário ou cria novo se não existir
export async function getUserOrCreate(chatId, nome) {
  let users = [];
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    users = JSON.parse(data);
  } catch { }
  let user = users.find((u) => u.chatId === chatId);
  if (!user) {
    user = { chatId, nome, plano: "free", usos: { ia: 0 } };
    users.push(user);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  }
  return user;
}

// Verifica se usuário pode usar determinada função (ex: ia, imagem, audio)
export async function podeUsarFuncao(chatId, funcao) {
  const user = await getUserOrCreate(chatId, "usuário");
  if (user.plano === "premium") return true;
  const limites = { ia: 5 }; // Limite grátis (exemplo)
  return (user.usos[funcao] || 0) < (limites[funcao] || 0);
}

// Atualiza o contador de uso de uma função
export async function atualizarLimite(chatId, funcao) {
  let users = [];
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    users = JSON.parse(data);
  } catch { }
  const user = users.find((u) => u.chatId === chatId);
  if (user) {
    user.usos[funcao] = (user.usos[funcao] || 0) + 1;
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  }
}

// Opcional: Função para listar todos os usuários (útil para admin/broadcast)
export async function getAllUsers() {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}
