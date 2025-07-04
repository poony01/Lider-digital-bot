// services/userService.js
import fs from "fs";
import path from "path";

const filePath = path.resolve("dados/usuarios.json");

export function verificarOuCriarUsuario(chatId, nome) {
  try {
    const usuarios = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];

    const existe = usuarios.find(u => u.id === chatId);

    if (!existe) {
      usuarios.push({ id: chatId, nome, plano: "nenhum", mensagens: 0 });
      fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
    }
  } catch (e) {
    console.error("Erro salvar JSON:", e);
    throw e;
  }
}
