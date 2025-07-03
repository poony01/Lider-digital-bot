// Serviço para gerenciamento de limites do usuário (extensível para vários tipos de limites)

import { getUserOrCreate, atualizarLimite } from "./users.js";

// Limites padrão por tipo de função e plano
const LIMITES = {
  free: {
    ia: 5,
    imagem: 2,
    audio: 2
  },
  premium: {
    ia: Infinity,
    imagem: Infinity,
    audio: Infinity
  }
};

export async function checarLimite(chatId, funcao, plano = "free") {
  const user = await getUserOrCreate(chatId, "usuário");
  const limite = LIMITES[user.plano || plano][funcao] || 0;
  const usos = user.usos[funcao] || 0;
  return usos < limite;
}

export async function registrarUso(chatId, funcao) {
  await atualizarLimite(chatId, funcao);
}
