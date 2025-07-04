// services/userService.js
import fs from "fs";
const CAMINHO_ARQUIVO = "./dados/usuarios.json";

// ID do dono (sempre com acesso total)
const DONO_ID = process.env.DONO_ID || "1451510843";

// Carrega os usuários do JSON
function carregarUsuarios() {
  try {
    const dados = fs.readFileSync(CAMINHO_ARQUIVO, "utf8");
    return JSON.parse(dados);
  } catch {
    return {};
  }
}

// Salva os dados no JSON
function salvarUsuarios(usuarios) {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(usuarios, null, 2));
}

// Garante que o usuário exista no arquivo
export function verificarOuCriarUsuario(chatId, nome) {
  const usuarios = carregarUsuarios();
  if (!usuarios[chatId]) {
    usuarios[chatId] =
