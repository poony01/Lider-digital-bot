import fs from 'fs';
import path from 'path';

const caminhoConvites = path.resolve('dados', 'convidados.json');

function carregarConvites() {
  try {
    if (!fs.existsSync(caminhoConvites)) {
      fs.writeFileSync(caminhoConvites, JSON.stringify({}));
    }
    const data = fs.readFileSync(caminhoConvites);
    return JSON.parse(data);
  } catch (erro) {
    console.error('Erro ao carregar os convites:', erro.message);
    return {};
  }
}

function salvarConvites(convites) {
  try {
    fs.writeFileSync(caminhoConvites, JSON.stringify(convites, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar os convites:', erro.message);
  }
}

export function gerarLinkConvite(userId) {
  const baseUrl = 'https://t.me/Liderdigitalbot?start=';
  return `${baseUrl}convite_${userId}`;
}

export function registrarConvite(idConvidado, idQuemConvidou) {
  const convites = carregarConvites();

  if (!convites[idQuemConvidou]) {
    convites[idQuemConvidou] = [];
  }

  if (!convites[idQuemConvidou].includes(idConvidado)) {
    convites[idQuemConvidou].push(idConvidado);
    salvarConvites(convites);
  }
}

export function listarConvidados(idUsuario) {
  const convites = carregarConvites();
  return convites[idUsuario] || [];
}

export function contarConvidados(idUsuario) {
  const convites = carregarConvites();
  return convites[idUsuario]?.length || 0;
}
