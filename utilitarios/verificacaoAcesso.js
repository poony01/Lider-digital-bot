// Funções utilitárias para verificar acesso do usuário a planos e permissões.

import fs from "fs/promises";
const USUARIOS_PATH = "./dados/usuarios.json";

export async function usuarioTemAcesso(userId, recurso) {
  // recurso: 'basico', 'premium', etc.
  try {
    const lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
    const user = lista.find(u => u.id === userId);
    if (!user) return false;
    if (user.bloqueado) return false;
    if (user.plano === 'premium') return true;
    if (user.plano === 'basico' && recurso === 'basico') return true;
    return false;
  } catch {
    return false;
  }
}

export async function isDono(userId) {
  // DONO_ID deve ser carregado do process.env
  return String(userId) === String(process.env.DONO_ID);
}
