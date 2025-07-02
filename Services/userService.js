import fs from 'fs';
import path from 'path';

const caminhoUsuarios = path.resolve('dados', 'usuarios.json');

function carregarUsuarios() {
  try {
    if (!fs.existsSync(caminhoUsuarios)) {
      fs.writeFileSync(caminhoUsuarios, JSON.stringify({}));
    }
    const data = fs.readFileSync(caminhoUsuarios);
    return JSON.parse(data);
  } catch (erro) {
    console.error('Erro ao carregar os usuários:', erro.message);
    return {};
  }
}

function salvarUsuarios(usuarios) {
  try {
    fs.writeFileSync(caminhoUsuarios, JSON.stringify(usuarios, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar os usuários:', erro.message);
  }
}

export function registrarUsuario(userId, nome) {
  const usuarios = carregarUsuarios();

  if (!usuarios[userId]) {
    usuarios[userId] = {
      nome,
      acessoLiberado: false,
      plano: null,
      dataInicio: null,
      dataExpiracao: null
    };
    salvarUsuarios(usuarios);
  }

  return usuarios[userId];
}

export function liberarAcesso(userId, plano, dias) {
  const usuarios = carregarUsuarios();
  const hoje = new Date();
  const expiracao = new Date();
  expiracao.setDate(hoje.getDate() + dias);

  usuarios[userId] = {
    ...usuarios[userId],
    acessoLiberado: true,
    plano,
    dataInicio: hoje.toISOString(),
    dataExpiracao: expiracao.toISOString()
  };

  salvarUsuarios(usuarios);
}

export function bloquearAcesso(userId) {
  const usuarios = carregarUsuarios();
  if (usuarios[userId]) {
    usuarios[userId].acessoLiberado = false;
    salvarUsuarios(usuarios);
  }
}

export function obterUsuario(userId) {
  const usuarios = carregarUsuarios();
  return usuarios[userId] || null;
}

export function listarUsuarios() {
  return carregarUsuarios();
}
