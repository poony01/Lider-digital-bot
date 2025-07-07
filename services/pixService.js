// services/pixService.js

export async function gerarCobrancaPix(valor, descricao = "Assinatura IA") {
  try {
    // Aqui você pode futuramente integrar com uma API real (PagSeguro, Gerencianet, etc)

    // Simula um QR Code Pix gerado
    return {
      qrCodeUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pix_logo_2020.png", // imagem exemplo
      copiaCola: `00020101021226820014br.gov.bcb.pix2563qrcode.fakepix.com.br/0123456789${Math.floor(
        Math.random() * 99999
      )}5204000053039865802BR5920LIDER DIGITAL BOT6009SAO PAULO62070503***6304ABCD`
    };
  } catch (error) {
    console.error("Erro ao gerar cobrança Pix:", error);
    return null;
  }
}
