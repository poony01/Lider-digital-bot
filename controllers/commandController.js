// controllers/commandController.js
import { getUser, updatePixKey } from "../services/userService.js";
import { readFileSync } from "fs";
import path from "path";

const arquivoUsuarios = path.resolve("dados/usuarios.json");
const arquivoPagamentos = path.resolve("dados/pagamentos.json");

export async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const texto = msg.text?.trim();
  const nome = msg.from.first_name || "Usuário";
  const userId = msg.from.id;
  const DONO_ID = Number(process.env.DONO_ID);

  if (!texto) return;

  const comando = texto.split(" ")[0];

  // Comando: /convidar
  if (comando === "/convidar") {
    const link = `https://t.me/${bot.username}?start=${chatId}`;
    await bot.sendMessage(chatId, `👥 *Convide e ganhe!*

Convide seus amigos usando seu link exclusivo. Para cada amigo que assinar, você ganha *50%* do valor da assinatura.

🔗 *Seu link:* ${link}
💸 *Mínimo para saque:* R$20,00

Use o comando /saldo para acompanhar seus ganhos.

Bora lucrar juntos! 🚀`, { parse_mode: "Markdown" });
    return;
  }

  // Comando: /saldo
  if (comando === "/saldo") {
    const user = await getUser(chatId);
    if (!user) {
      await bot.sendMessage(chatId, "❌ Você ainda não está registrado.");
      return;
    }

    const indicados = user.indicados || [];
    const totalIndicados = indicados.length;
    const valor = Number(user.saldo || 0).toFixed(2);

    await bot.sendMessage(chatId, `💰 *Seu Saldo*: R$${valor}
👥 *Indicados*: ${totalIndicados} pessoas

Use /saque para solicitar seu saldo.
`, { parse_mode: "Markdown" });
    return;
  }

  // Comando: /saque
  if (comando === "/saque") {
    const user = await getUser(chatId);
    if (!user || !user.pix) {
      await bot.sendMessage(chatId, "❌ Você ainda não cadastrou sua chave Pix. Use /pixminhachave.");
      return;
    }

    const valor = Number(user.saldo || 0);

    if (valor < 20) {
      await bot.sendMessage(chatId, "⚠️ O valor mínimo para saque é R$20,00.");
      return;
    }

    // Enviar notificação ao dono
    const texto = `📤 *Novo saque solicitado:*
👤 Nome: ${user.nome}
💰 Valor: R$${valor.toFixed(2)}
🔑 Pix: ${user.pix}
🆔 ID: ${chatId}`;

    await bot.sendMessage(DONO_ID, texto, { parse_mode: "Markdown" });
    await bot.sendMessage(chatId, "✅ Sua solicitação foi enviada. Aguarde o pagamento manual.");
    return;
  }

  // Comando: /pixminhachave nova_chave
  if (comando === "/pixminhachave") {
    const novaChave = texto.replace("/pixminhachave", "").trim();
    if (!novaChave) {
      await bot.sendMessage(chatId, "❌ Envie o comando assim:\n/pixminhachave suachave@pix.com");
      return;
    }

    await updatePixKey(chatId, novaChave);
    await bot.sendMessage(chatId, "✅ Chave Pix atualizada com sucesso.");
    return;
  }

  // ADMINISTRADOR: /assinantes
  if (comando === "/assinantes" && userId === DONO_ID) {
    const json = JSON.parse(readFileSync(arquivoUsuarios, "utf8"));
    const total = json.length;
    const assinantes = json.filter(u => u.plano === "premium").length;
    const gratuitos = total - assinantes;

    await bot.sendMessage(chatId, `📊 *Relatório de Assinantes:*
👥 Total de usuários: ${total}
✅ Assinantes (Premium): ${assinantes}
🆓 Gratuitos: ${gratuitos}`, { parse_mode: "Markdown" });
    return;
  }

  // ADMINISTRADOR: /indicacoes
  if (comando === "/indicacoes" && userId === DONO_ID) {
    const json = JSON.parse(readFileSync(arquivoUsuarios, "utf8"));
    const lista = json.map(u => {
      const indicados = u.indicados?.length || 0;
      return `👤 ${u.nome} (${u.chat_id}) — ${indicados} indicado(s)`;
    });

    const texto = lista.length ? lista.join("\n") : "Nenhuma indicação encontrada.";
    await bot.sendMessage(chatId, `📨 *Indicações:*\n\n${texto}`, { parse_mode: "Markdown" });
    return;
  }

  // ADMINISTRADOR: /pagamentos
  if (comando === "/pagamentos" && userId === DONO_ID) {
    const pagamentos = JSON.parse(readFileSync(arquivoPagamentos, "utf8"));
    if (!pagamentos.length) {
      await bot.sendMessage(chatId, "📭 Nenhum pagamento pendente.");
      return;
    }

    const texto = pagamentos.map((p, i) => `#${i + 1}\n👤 ${p.nome} — R$${p.valor}\n🔑 ${p.pix}\n🆔 ${p.chat_id}`).join("\n\n");
    await bot.sendMessage(chatId, `📥 *Pagamentos Pendentes:*\n\n${texto}`, { parse_mode: "Markdown" });
    return;
  }

  // ADMINISTRADOR: /usuarios
  if (comando === "/usuarios" && userId === DONO_ID) {
    const json = JSON.parse(readFileSync(arquivoUsuarios, "utf8"));
    const texto = json.map(u => `🆔 ${u.chat_id} — ${u.nome} (${u.plano})`).join("\n");
    await bot.sendMessage(chatId, `👥 *Lista de Usuários:*\n\n${texto}`, { parse_mode: "Markdown" });
    return;
  }
}
