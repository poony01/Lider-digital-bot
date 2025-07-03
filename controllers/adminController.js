// controllers/adminController.js

// Substitua pelo seu ID de Telegram
const DONO_ID = parseInt(process.env.DONO_ID);

import fs from "fs";

export async function adminController(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.toLowerCase();

  if (chatId !== DONO_ID) return false; // Só o dono pode usar

  if (texto === "/admin") {
    const usuarios = carregarJSON("dados/usuarios.json");
    const assinantes = carregarJSON("dados/pagamentos.json");

    const totalUsuarios = Object.keys(usuarios).length;
    const totalAssinantes = Object.values(assinantes).filter(a => a.status === "ativo").length;

    await bot.sendMessage(chatId, `📊 Relatório do Bot:\n\n👥 Usuários: ${totalUsuarios}\n💰 Assinantes: ${totalAssinantes}`);
    return true;
  }

  return false;
}

function carregarJSON(caminho) {
  try {
    const dados = fs.readFileSync(caminho, "utf-8");
    return JSON.parse(dados);
  } catch (e) {
    return {};
  }
}
