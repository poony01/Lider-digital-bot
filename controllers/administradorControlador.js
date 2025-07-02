import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DONO_ID } from "../configuracoes.js";
import { listarAssinantes, bloquearUsuario, desbloquearUsuario } from "../serviços/usuarioService.js";
import { obterConvidados } from "../serviços/conviteService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function administradorControlador(bot, msg) {
  const chatId = msg.chat.id.toString();

  if (chatId !== DONO_ID) {
    return;
  }

  const texto = msg.text?.toLowerCase();

  if (texto === "painel") {
    const assinantes = await listarAssinantes();
    let resposta = `📊 *Painel do Administrador*\n\n👥 Total de Assinantes: ${assinantes.length}\n`;

    for (const user of assinantes) {
      const convidados = await obterConvidados(user.id);
      resposta += `\n🧑 ${user.nome} - ${convidados.length} convidados - Expira em: ${user.expiracao || "n/d"}`;
    }

    await bot.sendMessage(chatId, resposta, { parse_mode: "Markdown" });
    return;
  }

  if (texto?.startsWith("bloquear")) {
    const partes = texto.split(" ");
    const idAlvo = partes[1];
    if (idAlvo) {
      await bloquearUsuario(idAlvo);
      await bot.sendMessage(chatId, `🔒 Usuário ${idAlvo} bloqueado.`);
    }
    return;
  }

  if (texto?.startsWith("desbloquear")) {
    const partes = texto.split(" ");
    const idAlvo = partes[1];
    if (idAlvo) {
      await desbloquearUsuario(idAlvo);
      await bot.sendMessage(chatId, `✅ Usuário ${idAlvo} desbloqueado.`);
    }
    return;
  }

  if (texto?.startsWith("enviar")) {
    const mensagem = texto.replace("enviar", "").trim();
    if (mensagem) {
      const assinantes = await listarAssinantes();
      for (const user of assinantes) {
        await bot.sendMessage(user.id, `📢 Mensagem do administrador:\n\n${mensagem}`);
      }
      await bot.sendMessage(chatId, "✅ Mensagem enviada para todos os assinantes.");
    }
  }
}
