import qrcode from "qrcode";

export async function gerarQRCode(codigoPix) {
  try {
    return await qrcode.toDataURL(codigoPix);
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    return null;
  }
}
