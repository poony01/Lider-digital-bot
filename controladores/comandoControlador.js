// Controlador dos comandos principais do bot (/start, /plano, /ajuda, etc.)

import mensagemControlador from './mensagemControlador.js';
import usuarioService from '../serviços/usuarioService.js';

export default {
  async start(ctx) {
    const nome = ctx.message.from.first_name || 'usuário';
    await ctx.reply(`Olá ${nome}, seja bem-vindo ao bot! Use /plano para ver os planos disponíveis.`);
    await usuarioService.registrarUsuario(ctx.message.from);
  },

  async plano(ctx) {
    const textoPlano = mensagemControlador.textoPlanos();
    await ctx.reply(textoPlano);
  },

  async ajuda(ctx) {
    await ctx.reply(mensagemControlador.textoAjuda());
  },

  // Outros comandos podem ser adicionados aqui...
};
