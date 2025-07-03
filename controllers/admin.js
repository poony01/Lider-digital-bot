import { bot } from "../index.js";

// Lista de IDs dos administradores (adicione os IDs dos admins do bot)
const ADMINS = [123456789, 987654321];

function isAdmin(chatId) {
  return ADMINS.includes(chatId);
}

// Exemplo: comando para enviar broadcast para todos os usuários (você vai adaptar para ler dos dados depois)
export async function handleAdminCommand(msg) {
  const chatId = msg.chat.id;
  const texto = msg.text ? msg.text.trim() : "";

  if (!isAdmin(chatId)) {
    await bot.sendMessage(chatId, "❌ Comando restrito a administradores.");
    return;
  }

  // Comando de broadcast (enviar mensagem para todos)
  if (texto.startsWith("/broadcast ")) {
    const mensagem = texto.replace("/broadcast ", "");
    // Aqui você vai buscar todos os usuários do seu banco e enviar a mensagem para cada um
    // Exemplo:
    // const users = await getAllUsers();
    // for (const user of users) {
    //   await bot.sendMessage(user.chatId, mensagem);
    // }
    await bot.sendMessage(chatId, `Mensagem de broadcast enviada (simulação): ${mensagem}`);
    return;
  }

  // Comando para listar usuários (simulação)
  if (texto === "/admin_users") {
    // const users = await getAllUsers();
    // await bot.sendMessage(chatId, `Total de usuários: ${users.length}`);
    await bot.sendMessage(chatId, "Total de usuários: (simulação)");
    return;
  }

  // Adicione mais comandos de admin conforme necessidade

  // Mensagem padrão para comandos de admin não reconhecidos
  await bot.sendMessage(chatId, "Comando de admin não reconhecido.");
}
