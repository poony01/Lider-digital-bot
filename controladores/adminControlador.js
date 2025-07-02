// Controlador para funções administrativas do bot (painel, bloqueio, mensagens em massa, etc.)

import usuarioService from '../serviços/usuarioService.js';
import pagamentoService from '../serviços/pagamentoService.js';

export default {
  async verPainel(req, res) {
    // Exemplo: retorna dados resumidos do painel
    const totalUsuarios = await usuarioService.contarUsuarios();
    const assinantes = await usuarioService.listarAssinantes();
    const pagamentos = await pagamentoService.listarPagamentos();
    res.json({ totalUsuarios, assinantes, pagamentos });
  },

  async bloquearUsuario(userId) {
    return usuarioService.bloquearUsuario(userId);
  },

  async desbloquearUsuario(userId) {
    return usuarioService.desbloquearUsuario(userId);
  },

  // Envio de mensagem em massa
  async enviarMensagemTodos(mensagem) {
    return usuarioService.enviarMensagemTodos(mensagem);
  },
};
