// services/pixService.js
import https from 'https';
import fetch from 'node-fetch';

const clientId = process.env.EFI_CLIENT_ID;
const clientSecret = process.env.EFI_CLIENT_SECRET;
const pixNome = process.env.EFI_PIX_NOME;
const pixChave = process.env.EFI_PIX_CHAVE;
const certPassword = process.env.EFI_CERT_PASSWORD;
const certBase64 = process.env.EFI_CERT_BASE64;

const certBuffer = Buffer.from(certBase64, 'base64');

const agent = new https.Agent({
  pfx: certBuffer,
  passphrase: certPassword,
  rejectUnauthorized: false
});

async function getAccessToken() {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://api.efi.com.br/v1/authorize', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    agent
  });

  const data = await res.json();
  return data.access_token;
}

export async function gerarCobrancaPix(valor, descricao = "Assinatura do Bot") {
  const token = await getAccessToken();

  const body = {
    calendario: { expiracao: 3600 },
    devedor: { nome: pixNome },
    valor: { original: valor.toFixed(2) },
    chave: pixChave,
    infoAdicionais: [{ nome: "Plano", valor: descricao }]
  };

  const res = await fetch('https://api.efi.com.br/v2/cob', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    agent
  });

  const data = await res.json();

  if (data?.loc?.id) {
    const qrRes = await fetch(`https://api.efi.com.br/v2/loc/${data.loc.id}/qrcode`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      agent
    });

    const qrData = await qrRes.json();
    return {
      qrCodeUrl: qrData.imagemQrcode,
      copiaCola: qrData.qrcode
    };
  }

  return null;
}
