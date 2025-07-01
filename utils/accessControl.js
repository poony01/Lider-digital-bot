import { verificarAssinatura } from "../services/userService.js";

export async function verificarAcessoPremium(userId) {
  try {
    const acesso = await verificarAssinatura(userId);
    return acesso;
  } catch (error) {
    console.error("Erro ao verificar acesso premium:", error.message);
    return false;
  }
}
