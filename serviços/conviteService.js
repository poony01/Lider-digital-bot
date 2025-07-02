// Serviço para controle de convites, comissões e saldo de indicação.

import fs from "fs/promises";
const USUARIOS_PATH = "./dados/usuarios.json";

export default {
  async gerarLinkConvite(usuarioId) {
    // Gera um link único de convite.
    return `https://t.me/SEU_BOT_USERNAME?start=${usuarioId}`;
  },

  async registrarIndicado(indicadorId, indicadoId) {
    // Associa indicado ao indicador no JSON.
    try {
      const lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
      const indicado = lista.find(u => u.id === indicadoId);
      if (indicado && !indicado.indicadorId) {
        indicado.indicadorId = indicadorId;
        await fs.writeFile(USUARIOS_PATH, JSON.stringify(lista, null, 2));
      }
    } catch {}
  },

  async calcularComissao(usuarioId) {
    // Calcula saldo de comissão do usuário (mock).
    return 0;
  },

  async totalConvidados(usuarioId) {
    try {
      const lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
      return lista.filter(u => u.indicadorId === usuarioId).length;
    } catch {
      return 0;
    }
  }
};
