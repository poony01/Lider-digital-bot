// pixService.js
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { gerarCobrancaPix } from "../services/gerarCobrancaPix.js";

const CAMINHO_PAGAMENTOS = path.resolve("dados/pagamentos.json");
const CAMINHO_USUARIOS = path.resolve("dados/usuarios.json");

// Lê o arquivo JSON de pagamentos
function carregarPagamentos() {
  if (!existsSync(CAMINHO_PAGAMENTOS)) return [];
  const dados = readFileSync(CAMINHO_PAGAMENTOS);
  return JSON.parse(dados);
}

// Salva o arquivo JSON de pagamentos
function salvarPagamentos(lista) {
  writeFileSync(CAMINHO_PAGAMENTOS, JSON.stringify(lista, null, 2));
}

// Marca pagamento como processado
export function marcarComoPago(pagamentoId) {
  const lista = carregarPagamentos();
  const index = lista.findIndex(p => p.id === pagamentoId);
  if (index !== -1) {
    lista[index].status = "pago";
    salvarPagamentos(lista);
    return true;
  }
  return false;
}

// Cria uma nova cobrança e salva no arquivo
export async function criarCobranca(chatId, plano) {
  const valor = plano === "premium" ? 22.9 : 14.9;
  const descricao = plano === "premium" ? "Plano Premium" : "Plano Básico";

  const cobranca = await gerarCobrancaPix(valor, descricao);
  if (!cobranca) return null;

  const lista = carregarPagamentos();
  lista.push({
    id: cobranca.id,
    chat_id: chatId,
    plano,
    valor,
    status: "pendente",
    criado_em: new Date().toISOString(),
    chave_pix: process.env.PIX_CHAVE
  });
  salvarPagamentos(lista);

  return cobranca;
}

// Ativa o plano do usuário após o pagamento
export function ativarPlano(chatId, plano) {
  if (!existsSync(CAMINHO_USUARIOS)) return false;
  const lista = JSON.parse(readFileSync(CAMINHO_USUARIOS));
  const index = lista.findIndex(u => u.chat_id === chatId.toString());
  if (index === -1) return false;

  lista[index].plano = plano;
  lista[index].ativado_em = new Date().toISOString();
  writeFileSync(CAMINHO_USUARIOS, JSON.stringify(lista, null, 2));
  return true;
}
