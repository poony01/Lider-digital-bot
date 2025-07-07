import axios from 'axios';

const EFI_CLIENT_ID = process.env.EFI_CLIENT_ID;
const EFI_CLIENT_SECRET = process.env.EFI_CLIENT_SECRET;
const EFI_PIX_CHAVE = process.env.EFI_PIX_CHAVE;
const EFI_PIX_NOME = process.env.EFI_PIX_NOME;

export async function gerarCobrancaPix(valor, descricao, txid) {
  // Exemplo simplificado, pois integração real depende da autenticação OAuth2 e certificado .p12
  // Use a Gerencianet API oficial: https://dev.gerencianet.com.br/docs/recebendo-pagamentos-com-pix
  // Aqui só um stub para ilustrar:
  return {
    txid,
    valor,
    copiaCola: "00020126...",
    qrCodeUrl: "https://...",
    status: "ATIVA",
    vencimento: new Date(Date.now() + 60*60*1000)
  };
}
