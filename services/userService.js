// services/userService.js
import fs from "fs";
import path from "path";

const filePath = path.resolve("dados/usuarios.json");

export function verificarOuCriarUsuario(chatId, nome) {
  try {
    // Garante que o arquivo existe
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, "[]", "utf-8");
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const usuarios = JSON.parse(data);

    const existe = usuarios.find(u => u.id === chatId);

    if (!existe) {
      usuarios.push({ id: chatId, nome, plano: "nenhum", mensagens: 0 });
      fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("❌ ERRO userService:", e);
    throw e;
  }
}
