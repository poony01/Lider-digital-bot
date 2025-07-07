import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

const CHAVE_PIX = process.env.PIX_CHAVE;
const NOME_RECEBEDOR = process.env.PIX_NOME || "Recebedor";

export async function gerarCobrancaPix(valor, descricao = "Pagamento") {
  const txid = uuidv4(); // ID único da transação

  try {
    const response = await fetch("https://api-pix.gerencianet.com.br/qrcode/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        valor,
        chave: CHAVE_PIX,
        nome: NOME_RECEBEDOR,
        descricao,
        txid
      })
    });

    if (!response.ok) {
      console.error("Erro ao gerar cobrança Pix:", await response.text());
      return null;
    }

    const data = await response.json();

    return {
      copiaCola: data.copiaCola,
      qrCodeUrl: data.qrCodeUrl,
      txid
    };

  } catch (err) {
    console.error("Erro Pix:", err.message);
    return null;
  }
}
