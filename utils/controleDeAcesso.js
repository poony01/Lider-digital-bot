export function verificarAcesso(usuario, idDono) {
  if (usuario.id === idDono) return 'dono';
  if (usuario.status === 'ativo') return 'assinante';
  return 'nao_assinante';
}
