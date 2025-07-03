// services/userService.js

import fs from "fs";
const caminhoUsuarios = "dados/usuarios.json";

function carregarUsuarios() {
  try {
    const data = fs.readFileSync(caminhoUsuarios);
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  fs.writeFileSync(caminhoUsuarios, JSON.stringify(usuarios, null, 2));
}

export function verificarOuCriarUsuario(chatId, nome) {
  const usuarios = carregarUsuarios();
  const existente = usuarios.find((u) => u.chatId === chatId);

  if (!existente) {
    usuarios.push({ chatId, nome, assinante: false });
    salvarUsuarios(usuarios);
  }
}

export function marcarComoAssinante(chatId) {
  const usuarios = carregarUsuarios();
  const usuario = usuarios.find((u) => u.chatId === chatId);
  if (usuario) {
    usuario.assinante = true;
    salvarUsuarios(usuarios);
  }
}

export function contarUsuarios() {
  return carregarUsuarios().length;
}

export function contarAssinantes() {
  return carregarUsuarios().filter((u) => u.assinante).length;
}
