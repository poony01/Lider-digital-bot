import qrcode from 'qrcode';
import { salvarAssinante, obterAssinante } from './userService.js';
import { gerarCodigoCopiaECola } from '../helpers/paymentUtils.js';
import { DONO_ID, PIX_CHAVE, PIX_NOME } from '../config.js';

const planos = [
  { nome: 'Básico', valor: 1890, descricao: 'Imagens, vídeos simples e respostas com IA.' },
  { nome: 'Premium', valor: 2290, descricao: 'Imagens e vídeos avançados, IA completa e prioridade no suporte.' },
];

export function listarPlanosTexto() {
  return planos.map(p =>
    `💠 *Plano ${p.nome}* - R$ ${(p.valor / 100).toFixed(2)}\n${p.descricao}`
  ).join('\n\n');
}

export async function gerarPagamentoPlano(userId, nomePlano) {
  const plano = planos.find(p => p.nome.toLowerCase() === nomePlano.toLowerCase());
  if (!plano) {
    return { erro: 'Plano não encontrado.' };
  }

  const idTransacao = `${userId}-${Date.now()}`;
  const valor = plano.valor;

  const pixCopiaECola = gerarCodigoCopiaECola({
    nome: PIX_NOME,
    chave: PIX_CHAVE,
    valor: valor / 100,
    cidade: 'BOTPIX',
    transacaoId: idTransacao,
  });

  const qrCodeBuffer = await qrcode.toBuffer(pixCopiaECola, { type: 'png' });

  return {
    nomePlano: plano.nome,
    descricao: plano.descricao,
    valor,
    pixCopiaECola,
    qrCodeBuffer,
    idTransacao
  };
}

export async function verificarPagamento(userId) {
  const assinante = await obterAssinante(userId);
  if (!assinante) return false;

  return assinante.pagamentoConfirmado === true;
}

export async function confirmarPagamento(userId, plano) {
  const dataAtual = new Date();
  const dataExpiracao = new Date();
  dataExpiracao.setDate(dataAtual.getDate() + 30);

  await salvarAssinante(userId, {
    plano,
    pagamentoConfirmado: true,
    dataInicio: dataAtual.toISOString(),
    dataExpiracao: dataExpiracao.toISOString()
  });
}
