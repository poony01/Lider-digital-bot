// services/userService.js
import fs from "fs";
const caminho = "dados/usuarios.json";
const DONO_ID = process.env.DONO_ID;

export async function verificarOuCriarUsuario(id, nome) {
  const usuarios = JSON.parse(fs.readFileSync(caminho, "utf-8"));
  if (!usuarios[id]) {
    usuarios[id] = {
      nome,
      mensagens: 0,
      plano: id == DONO_ID ? "premium" : "gratuito"
    };
    fs.writeFileSync(caminho, JSON.stringify(usuarios, null, 2));
  }
}

export async function buscarPlanoUsuario(id) {
  const usuarios = JSON.parse(fs.readFileSync(caminho, "utf-8"));
  if (String(id) === String(DONO_ID)) return "premium";
  return usuarios[id]?.plano || "gratuito";
}
