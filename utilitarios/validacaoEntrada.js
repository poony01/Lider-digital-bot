// Função para validar entradas do usuário: texto, comandos, limites etc.

export function validarTexto(texto, tamanhoMin = 1, tamanhoMax = 200) {
  if (typeof texto !== 'string') return false;
  const t = texto.trim();
  return t.length >= tamanhoMin && t.length <= tamanhoMax;
}

export function validarComando(comando, listaPermitida = []) {
  return listaPermitida.includes(comando);
}
