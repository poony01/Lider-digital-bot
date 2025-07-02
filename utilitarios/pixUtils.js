// Funções auxiliares para geração e validação de Pix (chave, QR Code, copiar e colar, etc.)

export function gerarPixCopiaCola(chave, valor, nome) {
  // Gera string Pix Copia e Cola simulada (placeholder).
  // Integração real seria com API de pagamento.
  return `00020126580014BR.GOV.BCB.PIX0136${chave}520400005303986540${valor}5802BR5912${nome}6009SAO PAULO62070503***6304B014`;
}

export function validarChavePix(chave) {
  // Validação simples (chave não vazia, mínimo 6 caracteres)
  return typeof chave === 'string' && chave.length >= 6;
}
