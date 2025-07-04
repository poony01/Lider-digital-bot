// services/userService.js
import fs from "fs";
import path from "path";

const filePath = path.resolve("dados/usuarios.json");
const DONO_ID = process.env.DONO_ID;

function lerUsuarios() {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
}

export function verificarOuCriarUsuario(chatId, nome) {
  const usuarios = lerUsuarios();
  const existe = usuarios.find(u => u.id === chatId);

  if (!existe) {
    const plano = String(chatId) === DONO_ID ? "dono" : "nenhum";
    usuarios.push({ id: chatId, nome, plano, mensagens: 0 });
    salvarUsuarios(usuarios);
  }
}

export function buscarPlanoUsuario(chatId) {
  const usuarios = lerUsuarios();
  const user = usuarios.find(u => u.id === chatId);
  return user?.plano || "nenhum";
}

export function contarMensagens(chatId) {
  const usuarios = lerUsuarios();
  const index = usuarios.findIndex(u => u.id === chatId);
  if (index !== -1) {
    usuarios[index].mensagens = (usuarios[index].mensagens || 0) + 1;
    salvarUsuarios(usuarios);
  }
}
