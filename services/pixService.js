import https from "https";
import axios from "axios";
import fs from "fs";
import { Buffer } from "buffer";

// Variáveis de ambiente
const CERT_BASE64 = process.env.EFI_CERT_BASE64;
const CERT_PASSWORD = process.env.EFI_CERT_PASSWORD;
const CHAVE_PIX = process.env.EFI_PIX_CHAVE;
const API_URL = process.env.EFI_API_URL || "https://api.efipay.com.br";

const planos = {
  basico: {
    nome: "Plano Básico",
    valor: 14.9,
    texto: `✅ *Plano Básico – R$14,90/mês*\n\n• IA para perguntas e respostas\n• Geração de imagens simples\n• Transcrição de áudios\n• Suporte básico\n\nApós o pagamento, o plano será ativado automaticamente.`,
  },
  premium: {
    nome: "Plano Premium",
    valor: 22.9,
    texto: `🌟 *Plano Premium – R$22,90/mês*\n\n• Tudo do Plano Básico, mais:\n• Geração de vídeos com IA\n• Imagens realistas avançadas\n• Respostas mais longas\n• Suporte prioritário\n\nApós o pagamento, o plano será ativado automaticamente.`,
  },
};

// 🔐 Função para criar o agente HTTPS com certificado
function criarHttpsAgent() {
  const p12Buffer = Buffer.from(CERT_BASE64, "base64");

  return new https.Agent({
    pfx: p12Buffer,
    passphrase: CERT_PASSWORD,
  });
}

// 🔑 Função para gerar cobrança Pix
export async function gerarCobrancaPix(tipoPlano, userId) {
  const plano = planos[tipoPlano];
  if (!plano) throw new Error("Plano inválido");

  const httpsAgent = criarHttpsAgent();

  // Criar cobrança
  const bodyCob = {
    calendario: { expiracao: 3600 },
    valor: { original: plano.valor.toFixed(2) },
    chave: CHAVE_PIX,
    infoAdicionais: [
      { nome: "Plano", valor: plano.nome },
      { nome: "ID", valor: `${userId}` },
    ],
  };

  // Envia cobrança
  const respostaCob = await axios.post(`${API_URL}/v2/cob`, bodyCob, { httpsAgent });
  const locId = respostaCob?.data?.loc?.id;
  if (!locId) throw new Error("Erro ao criar cobrança Pix");

  // Gera QR Code
  const respostaQr = await axios.get(`${API_URL}/v2/loc/${locId}/qrcode`, { httpsAgent });
  const { qrcode, imagemQrcode } = respostaQr.data;

  return {
    texto: plano.texto,
    codigoPix: qrcode,
    imagemUrl: imagemQrcode,
  };
}
