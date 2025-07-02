// ajudantes/pagamentoUtils.js
import fs from "fs";
import path from "path";

const CAMINHO_ASSINANTES = path.resolve("dados", "assinantes.json");
const CHAVE_PIX = process.env.PIX_CHAVE;
const DONO_ID = process.env.DONO_ID;

// Verifica se o usuário já pagou
export function verificarAssinatura(idUsuario) {
  try {
    const dados = JSON.parse(fs.readFileSync(CAMINHO_ASSINANTES));
    const assinante = dados.find(user => user.id === idUsuario);
    if (!assinante) return false;

    const agora = new Date();
    const expiracao = new Date(assinante.expiraEm);
    return agora <= expiracao;
  } catch (err) {
    console.error("Erro ao verificar assinatura:", err);
    return false;
  }
}

// Salva um novo assinante
export function salvarAssinatura(idUsuario, nome, plano) {
  try {
    const dados = fs.existsSync(CAMINHO_ASSINANTES)
      ? JSON.parse(fs.readFileSync(CAMINHO_ASSINANTES))
      : [];

    const dias = plano === "premium" ? 30 : 15;
    const agora = new Date();
    const expiracao = new Date();
    expiracao.setDate(agora.getDate() + dias);

    const novo = {
      id: idUsuario,
      nome: nome || "Usuário",
      plano,
      criadoEm: agora.toISOString(),
      expiraEm: expiracao.toISOString(),
    };

    const filtrado = dados.filter(user => user.id !== idUsuario);
    filtrado.push(novo);

    fs.writeFileSync(CAMINHO_ASSINANTES, JSON.stringify(filtrado, null, 2));
    return true;
  } catch (err) {
    console.error("Erro ao salvar assinatura:", err);
    return false;
  }
}

// Verifica se o ID é do dono (acesso vitalício gratuito)
export function temAcessoGratis(idUsuario) {
  return String(idUsuario) === String(DONO_ID);
}
