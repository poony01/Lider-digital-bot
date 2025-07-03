// ATENÇÃO: Vercel NÃO permite escrita em disco local (writeFile, mkdir, etc) em produção.
// Para produção, use um banco de dados externo (MongoDB, Firebase, Planetscale, Supabase etc).

import fs from "fs/promises";

const usersFile = "./data/users.json";

// Busca usuário (apenas leitura)
export async function getUserOrCreate(chatId, nome) {
  let users = [];
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    users = JSON.parse(data);
  } catch (e) {
    // Se o arquivo não existe ou erro de leitura, retorna array vazio
    users = [];
  }
  let user = users.find((u) => u.chatId === chatId);
  // Em produção, não tente salvar em disco!
  if (!user) {
    user = { chatId, nome, plano: "free", usos: { ia: 0 } };
    // Descomente a linha abaixo APENAS para ambiente local (NUNCA na Vercel)
    // users.push(user);
    // await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  }
  return user;
}

// Em produção Vercel, só leitura!
export async function podeUsarFuncao(chatId, funcao) {
  const user = await getUserOrCreate(chatId, "usuário");
  if (user.plano === "premium") return true;
  const limites = { ia: 5 };
  return (user.usos?.[funcao] || 0) < (limites[funcao] || 0);
}

// Em produção Vercel, não atualize no disco!
export async function atualizarLimite(chatId, funcao) {
  // NOP: Não faz nada em produção serverless
}

// Listar usuários (apenas leitura)
export async function getAllUsers() {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}
