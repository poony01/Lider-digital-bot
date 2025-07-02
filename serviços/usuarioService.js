// Serviço para gerenciar usuários, planos e permissões.

import fs from "fs/promises";
const USUARIOS_PATH = "./dados/usuarios.json";

export default {
  async registrarUsuario(usuario) {
    // Registra usuário (salva no JSON).
    // Implementação simplificada, sem validação.
    let lista = [];
    try {
      lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
    } catch {}
    if (!lista.find(u => u.id === usuario.id)) {
      lista.push({ id: usuario.id, nome: usuario.first_name, plano: "free", bloqueado: false });
      await fs.writeFile(USUARIOS_PATH, JSON.stringify(lista, null, 2));
    }
  },

  async contarUsuarios() {
    try {
      const lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
      return lista.length;
    } catch {
      return 0;
    }
  },

  async listarAssinantes() {
    try {
      const lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
      return lista.filter(u => u.plano !== "free");
    } catch {
      return [];
    }
  },

  async bloquearUsuario(userId) {
    try {
      const lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
      const user = lista.find(u => u.id === userId);
      if (user) user.bloqueado = true;
      await fs.writeFile(USUARIOS_PATH, JSON.stringify(lista, null, 2));
    } catch {}
  },

  async desbloquearUsuario(userId) {
    try {
      const lista = JSON.parse(await fs.readFile(USUARIOS_PATH, "utf-8"));
      const user = lista.find(u => u.id === userId);
      if (user) user.bloqueado = false;
      await fs.writeFile(USUARIOS_PATH, JSON.stringify(lista, null, 2));
    } catch {}
  },

  async enviarMensagemTodos(mensagem) {
    // Placeholder: implementar integração com bot para envio em massa.
    return "Mensagem enviada para todos (placeholder)";
  }
};
