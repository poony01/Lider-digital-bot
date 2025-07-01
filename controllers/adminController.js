import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllUsers, updateUserStatus } from '../services/userService.js';
import { readJSON, writeJSON } from '../helpers/jsonHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convidadosPath = path.join(__dirname, '../data/convidados.json');
const saquesPath = path.join(__dirname, '../data/saques.json');

export async function handleAdmin(msg, bot) {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text === 'painel') {
    const users = await getAllUsers();
    const totalAtivos = users.filter(u => u.status === 'ativo').length;
    const totalBloqueados = users.filter(u => u.status === 'bloqueado').length;

    bot.sendMessage(chatId, `🔐 *Painel de Admin*\n\n👥 Usuários ativos: ${totalAtivos}\n🚫 Usuários bloqueados: ${totalBloqueados}`, { parse_mode: 'Markdown' });
  }

  if (text.startsWith('bloquear')) {
    const partes = text.split(' ');
    const userId = partes[1];
    if (userId) {
      await updateUserStatus(userId, 'bloqueado');
      bot.sendMessage(chatId, `🔒 Usuário ${userId} bloqueado com sucesso.`);
    }
  }

  if (text.startsWith('desbloquear')) {
    const partes = text.split(' ');
    const userId = partes[1];
    if (userId) {
      await updateUserStatus(userId, 'ativo');
      bot.sendMessage(chatId, `✅ Usuário ${userId} desbloqueado com sucesso.`);
    }
  }

  if (text === 'convidados') {
    const convidados = await readJSON(convidadosPath);
    let mensagem = `🎯 *Convidados por usuário:*\n\n`;
    for (const donoId in convidados) {
      mensagem += `👤 ID ${donoId}: ${convidados[donoId].length} convidados\n`;
    }
    bot.sendMessage(chatId, mensagem, { parse_mode: 'Markdown' });
  }

  if (text === 'saques') {
    const saques = await readJSON(saquesPath);
    if (saques.length === 0) {
      bot.sendMessage(chatId, 'Nenhum saque pendente no momento.');
      return;
    }

    let mensagem = '💸 *Solicitações de saque:*\n\n';
    saques.forEach((saque, index) => {
      mensagem += `#${index + 1}\nUsuário: ${saque.userId}\nValor: R$${saque.valor}\nChave Pix: ${saque.pix}\n\n`;
    });

    bot.sendMessage(chatId, mensagem, { parse_mode: 'Markdown' });
  }
}
