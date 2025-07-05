// services/userService.js

const usuarios = new Map(); // Armazena os dados dos usuários na memória

export function getUser(id) {
  if (!usuarios.has(id)) {
    usuarios.set(id, {
      id,
      plano: null,
      pix: null,
      saldo: 0,
      indicados: [],
    });
  }
  return usuarios.get(id);
}

export function updatePixKey(userId, chavePix) {
  const user = getUser(userId);
  if (user) {
    user.pix = chavePix;
  }
}

export function adicionarIndicacao(indicadorId, indicadoId) {
  const indicador = getUser(indicadorId);
  if (!indicador.indicados.includes(indicadoId)) {
    indicador.indicados.push(indicadoId);
    indicador.saldo += 10; // exemplo: R$10 por indicação
  }
}

export function getAllUsers() {
  return Array.from(usuarios.values());
}

export function getIndicacoes() {
  return getAllUsers().map(user => ({
    id: user.id,
    indicados: user.indicados
  }));
}
