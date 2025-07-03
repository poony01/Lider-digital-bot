// Lida com comandos exclusivos do admin/dono
export async function handleAdmin(text, chatId, userId) {
  const adminId = process.env.DONO_ID;
  if (`${userId}` !== `${adminId}`) return false;

  if (text.startsWith('/quantos')) {
    // TODO: Enviar número de usuários e assinantes
    return true;
  }

  // Outros comandos administrativos aqui

  return false; // Não era comando admin
}
