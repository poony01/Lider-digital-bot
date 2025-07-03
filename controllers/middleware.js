// Middleware de exemplo para autenticação, logging ou verificação de admin

export function requireAdmin(handler) {
  return async (msg) => {
    const ADMINS = [123456789, 987654321]; // Substitua pelos IDs reais dos admins
    const chatId = msg.chat.id;
    if (!ADMINS.includes(chatId)) {
      // Importação dinâmica para evitar problemas de dependência circular
      const { bot } = await import("../index.js");
      await bot.sendMessage(chatId, "❌ Você não tem permissão para acessar este comando.");
      return;
    }
    return handler(msg);
  };
}

// Exemplo de uso no admin.js:
// import { requireAdmin } from "./middleware.js";
// export const handleAdminCommand = requireAdmin(async (msg) => { ... });
