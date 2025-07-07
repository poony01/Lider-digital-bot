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

  if (!json.access_token) throw new Error("Erro ao gerar access_token");

  return json.access_token;
}

export async function gerarCobrancaPix(tipoPlano, userId) {
  const plano = planos[tipoPlano];
  if (!plano) throw new Error("Plano inválido");

  const token = await gerarAccessToken();

  const cobranca = {
    calendario: { expiracao: 3600 },
    devedor: { nome: "Cliente Bot", cpf: "00000000000" }, // opcional
    valor: { original: plano.valor.toFixed(2) },
    chave: CHAVE_PIX,
    infoAdicionais: [
      { nome: "Plano", valor: plano.nome },
      { nome: "ID", valor: `${userId}` },
    ],
  };

  // Cria cobrança
  const resposta1 = await fetch("https://api.efipay.com.br/v2/cob", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cobranca),
  });

  const json1 = await resposta1.json();
  const locId = json1.loc.id;

  if (!locId) throw new Error("Cobrança Pix falhou");

  // Gera QR Code
  const resposta2 = await fetch(`https://api.efipay.com.br/v2/loc/${locId}/qrcode`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json2 = await resposta2.json();

  return {
    texto: plano.texto,
    codigoPix: json2.qrcode,
    imagemUrl: json2.imagemQrcode, // Pode ser base64 ou link direto
  };
}
