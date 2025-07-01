import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUserById } from '../services/userService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assinantesPath = path.join(__dirname, '../data/assinantes.json');
const donoId = process.env.DONO_ID;

export function verificarAcessoLiberado(userId) {
  if (userId.toString() === donoId) return true;

  if (!fs.existsSync(assinantesPath)) return false;

  const dados = JSON.parse(fs.readFileSync(assinantesPath));
  const usuario = dados.find(u => u.id.toString() === userId.toString());
  if (!usuario) return false;

  const hoje = new Date();
  const validade = new Date(usuario.expiraEm);
  return validade >= hoje;
}

export function diasRestantes(userId) {
  if (!fs.existsSync(assinantesPath)) return 0;

  const dados = JSON.parse(fs.readFileSync(assinantesPath));
  const usuario = dados.find(u => u.id.toString() === userId.toString());
  if (!usuario) return 0;

  const hoje = new Date();
  const validade = new Date(usuario.expiraEm);
  const diffTime = validade - hoje;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
