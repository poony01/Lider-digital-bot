// services/userService.js
import fs from "fs";
const caminho = "./dados/usuarios.json";

function carregarUsuarios() {
  try {
    return JSON.parse(fs.readFileSync(caminho));
  } catch {
    return {};
  }
}

function salvarUsuarios(usuarios) {
  fs.writeFileSync(caminho, JSON.stringify(usuarios, null, 2));
}

export async function verificarOuCriarUsuario(chatId, nome) {
  const usuarios = carregarUsuarios();
  if (!usuarios[chatId]) {
    usuarios[chatId] = {
      nome,
      plano: "gratis",
      mensagensGratis: 5
    };
    salvarUsuarios(usuarios);
  }
}

export async function buscarPlanoUsuario(chatId) {
  const usuarios = carregarUsuarios();
  if (String(chatId) === process.env.DONO_ID) return "dono";
  return usuarios[chatId]?.plano || "gratis";
}

export async function registrarMensagem(chatId) {
  const usuarios = carregarUsuarios();
  const usuario = usuarios[chatId];

  if (usuario.plano === "gratis") {
    if (usuario.mensagensGratis > 0) {
      usuario.mensagensGratis--;
      salvarUsuarios(usuarios);
      return true;
    } else {
      return false;
    }
  }

  return true;
}
