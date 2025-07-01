import fs from 'fs';
import path from 'path';
import { formatarData } from '../helpers/formatDate.js';

const dataPath = path.resolve('data/');

function carregarJSON(nomeArquivo) {
  return JSON.parse(fs.readFileSync(path.join(dataPath, nomeArquivo)));
}

export async function handleAdmin(msg, bot) {
  const chatId = msg.chat.id;
  const texto = msg.text.toLowerCase();

  if (texto.startsWith('painel')) {
    const users = carregarJSON('users.json');
    const assinantes = carregarJSON('assinantes.json');
    const total = Object.keys(assinantes).length;
    return bot.sendMessage(chatId, `📊 *Painel Administrativo*\n\n👤 Total de usuários: ${Object.keys(users).length}\n✅ Assinantes ativos: ${total}`, { parse_mode: 'Markdown' });
  }

  if (texto.startsWith('bloquear')) {
    const partes = texto.split(' ');
    const id = partes[1];
    if (!id) return bot.sendMessage(chatId, `❗ Envie o comando assim: bloquear 123456789`);
    const assinantes = carregarJSON('assinantes.json');
    delete assinantes[id];
    fs.writeFileSync(path.join(dataPath, 'assinantes.json'), JSON.stringify(assinantes, null, 2));
    return bot.sendMessage(chatId, `🔒 Usuário ${id} bloqueado com sucesso.`);
  }

  if (texto.startsWith('desbloquear')) {
    const partes = texto.split(' ');
    const id = partes[1];
    if (!id) return bot.sendMessage(chatId, `❗ Envie o comando assim: desbloquear 123456789`);
    const users = carregarJSON('users.json');
    const user = users[id];
    if (!user) return bot.sendMessage(chatId, `❗ Usuário ${id} não encontrado.`);
    const assinantes = carregarJSON('assinantes.json');
    assinantes[id] = {
      plano: 'premium',
      inicio: formatarData(),
      fim: formatarData(31)
    };
    fs.writeFileSync(path.join(dataPath, 'assinantes.json'), JSON.stringify(assinantes, null, 2));
    return bot.sendMessage(chatId, `✅ Usuário ${id} desbloqueado com sucesso.`);
  }

  if (texto.startsWith('convidados')) {
    const partes = texto.split(' ');
    const id = partes[1];
    if (!id) return bot.sendMessage(chatId, `❗ Envie o comando assim: convidados 123456789`);
    const convidados = carregarJSON('convidados.json');
    const lista = convidados[id] || [];
    return bot.sendMessage(chatId, `👥 O usuário ${id} convidou ${lista.length} pessoas.\n${lista.join(', ')}`);
  }

  if (texto.startsWith('saques')) {
    const saques = carregarJSON('saques.json');
    const pendentes = Object.values(saques).filter(s => !s.pago);
    if (pendentes.length === 0) return bot.sendMessage(chatId, `✅ Nenhum saque pendente.`);
    const lista = pendentes.map(s => `💸 ${s.valor} - ${s.nomePix} (${s.pix})`).join('\n\n');
    return bot.sendMessage(chatId, `🔔 Saques pendentes:\n\n${lista}`);
  }
}
