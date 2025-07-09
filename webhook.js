import {
  salvarConvite,
  obterAfiliado,
  zerarSaldo,
  listarUsuarios,
} from "./services/afiliadoService.js";

const OWNER_ID = Number(process.env.OWNER_ID);
const OWNER_USERNAME = process.env.OWNER_USERNAME;

// Salvar convite quando link tiver parâmetro ?start=123
if (text.startsWith("/start ") && !isNaN(Number(text.split(" ")[1]))) {
  const indicadoPor = Number(text.split(" ")[1]);
  if (indicadoPor !== userId) {
    await salvarConvite(userId, indicadoPor);
  }
}

// /convidar
if (text === "/convidar") {
  const link = `https://t.me/${bot.username}?start=${userId}`;
  await bot.sendMessage(chat.id, `📢 Convide amigos com este link:\n${link}`);
  return res.end();
}

// /saldo
if (text === "/saldo") {
  const dados = await obterAfiliado(userId);
  const usuarios = await listarUsuarios();
  const indicados = usuarios.filter(u => u.convidado_por === userId);

  const premium = indicados.filter(i => i.plano === "premium").length;
  const basico = indicados.filter(i => i.plano === "basico").length;
  const gratuitos = indicados.filter(i => i.plano === "gratuito").length;

  await bot.sendMessage(chat.id, `💸 *Seu saldo:* R$${dados?.saldo?.toFixed(2) || 0}
👥 *Seus indicados:*
Premium: ${premium}
Básico: ${basico}
Gratuito: ${gratuitos}`, { parse_mode: "Markdown" });
  return res.end();
}

// /saque
if (text === "/saque") {
  return await bot.sendMessage(chat.id, `💰 *Solicitação de Saque*

• Valor mínimo para saque: R$20
• Envie assim: \`/saque VALOR CHAVEPIX NOME\`
Exemplo:
\`/saque 30.00 teste@pix.com.br Maria Silva\`

O pagamento será feito manualmente em até 24h.`, { parse_mode: "Markdown" });
}

// /saque VALOR PIX NOME
if (text.startsWith("/saque ") && text.split(" ").length >= 4) {
  const partes = text.split(" ");
  const valor = partes[1];
  const chave = partes[2];
  const nomePix = partes.slice(3).join(" ");

  if (OWNER_ID) {
    await bot.sendMessage(OWNER_ID, `📤 *Solicitação de Saque*

👤 @${from.username || "-"} (ID ${userId})
💸 Valor: R$${valor}
🔑 Chave Pix: ${chave}
🧾 Nome: ${nomePix}`, { parse_mode: "Markdown" });
  }

  return await bot.sendMessage(chat.id, `✅ Solicitação enviada! O pagamento será feito manualmente em até 24h.`);
}

// /usuarios (somente admin)
if (text === "/usuarios" && userId === OWNER_ID) {
  const todos = await listarUsuarios();
  await bot.sendMessage(chat.id, `👥 Total de usuários: ${todos.length}`);
  return res.end();
}

// /assinantes
if (text === "/assinantes" && userId === OWNER_ID) {
  const todos = await listarUsuarios();
  const premium = todos.filter(u => u.plano === "premium").length;
  const basico = todos.filter(u => u.plano === "basico").length;
  const gratuitos = todos.filter(u => u.plano === "gratuito").length;

  await bot.sendMessage(chat.id, `✨ Plano Premium: ${premium}
🔓 Plano Básico: ${basico}
🆓 Gratuito: ${gratuitos}`);
  return res.end();
}

// /indicações ID
if (text.startsWith("/indicações") && userId === OWNER_ID) {
  const id = Number(text.split(" ")[1]);
  if (!id) return await bot.sendMessage(chat.id, "ID inválido.");

  const todos = await listarUsuarios();
  const indicados = todos.filter(u => u.convidado_por === id);
  const premium = indicados.filter(i => i.plano === "premium").length;
  const basico = indicados.filter(i => i.plano === "basico").length;
  const gratuitos = indicados.filter(i => i.plano === "gratuito").length;

  const usuario = await obterAfiliado(id);

  await bot.sendMessage(chat.id, `📈 Estatísticas do ID ${id}

@${usuario?.username || "-"}
Premium: ${premium}
Básico: ${basico}
Gratuito: ${gratuitos}
Saldo: R$${usuario?.saldo?.toFixed(2) || 0}`);
  return res.end();
}

// /zerarsaldo ID
if (text.startsWith("/zerarsaldo") && userId === OWNER_ID) {
  const id = Number(text.split(" ")[1]);
  await zerarSaldo(id);
  return await bot.sendMessage(chat.id, `✅ Saldo do ID ${id} zerado.`);
}

// IA detecta sobre ganhar dinheiro
if (/ganhar dinheiro|renda extra|indicar|indicação|comissão/gi.test(text)) {
  const link = `https://t.me/${bot.username}?start=${userId}`;
  await bot.sendMessage(chat.id, `💸 Quer ganhar dinheiro com o bot?

Indique amigos usando seu link único:
${link}

Você ganha *50%* da primeira assinatura de cada indicado! 🔥`);
  return res.end();
}
