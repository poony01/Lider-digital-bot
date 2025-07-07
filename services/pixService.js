// pixService.js
import fetch from "node-fetch";

const CHAVE_PIX = process.env.EFI_PIX_CHAVE;
const CLIENT_ID = process.env.EFI_CLIENT_ID;
const CLIENT_SECRET = process.env.EFI_CLIENT_SECRET;

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

async function gerarAccessToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://api.efipay.com.br/authorize", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  });

  const json = await response.json();
  if (!json.access_token) throw new Error("Erro ao autenticar na Efi");

  return json.access_token;
}

export async function gerarCobrancaPix(tipoPlano, userId) {
  const plano = planos[tipoPlano];
  if (!plano) throw new Error("Plano inválido");

  const token = await gerarAccessToken();

  const body = {
    calendario: { expiracao: 3600 },
    valor: { original: plano.valor.toFixed(2) },
    chave: CHAVE_PIX,
    infoAdicionais: [
      { nome: "Plano", valor: plano.nome },
      { nome: "ID", valor: `${userId}` },
    ],
  };

  const response1 = await fetch("https://api.efipay.com.br/v2/cob", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json1 = await response1.json();
  if (!json1.loc?.id) throw new Error("Erro ao criar cobrança");

  const response2 = await fetch(`https://api.efipay.com.br/v2/loc/${json1.loc.id}/qrcode`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json2 = await response2.json();

  return {
    texto: plano.texto,
    codigoPix: json2.qrcode,
    imagemUrl: json2.imagemQrcode,
  };
}
