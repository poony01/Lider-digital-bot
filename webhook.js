// webhook.js
import { bot } from "./index.js";
import { salvarConvite, obterAfiliado, listarUsuarios, zerarSaldo } from "./services/afiliadoService.js";
import { limparMemoria } from "./services/memoryService.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";
import { askGPT } from "./services/iaService.js";

const OWNER_ID = Number(process.env.OWNER_ID);
const OWNER_USERNAME = process.env.OWNER_USERNAME;

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const nome = from?.first_name || "usuário";
      const userId = from.id;

      // ✅ /start com indicação
      if (text.startsWith("/start ") && !isNaN(Number(text.split(" ")[1]))) {
        const indicadoPor = Number(text.split(" ")[1]);
        if (indicadoPor !== userId) {
          await salvarConvite(userId, indicadoPor);
        }
      }

      // ✅ /start padrão
      if (text === "/start") {
        const boasVindas = `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n🎞️ Geração de vídeos\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\nEscolha abaixo para desbloquear acesso completo:`;

        await bot.sendMessage(chat.id, boasVindas, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔓 Assinar Plano Básico – R$14,90", callback_data: "plano_basico" }],
              [{ text: "✨ Assinar Plano Premium – R$22,90", callback_data: "plano_premium" }]
            ]
          }
        });
        return res.end();
      }

      // ✅ /limpar
      if (text === "/limpar") {
        await limparMemoria(userId);
        await bot.sendMessage(chat.id, "🧹 Sua memória foi limpa com sucesso!");
        return res.end();
      }

      // ✅ /convidar
      if (text === "/convidar") {
        const link = `https://t.me/Liderdigitalbot?start=${userId}`;
        const msg = `💸 *Ganhe dinheiro indicando amigos!*\n\nConvide amigos para usar o bot e receba *50% da primeira assinatura* de cada um.\n\n💰 Saques a partir de *R$20* via Pix.\n\nSeu link de convite único está abaixo:\n${link}`;

        await bot.sendMessage(chat.id, msg, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📢 Compartilhar meu link de convite", url: link }]
            ]
          }
        });
        return res.end();
      }

      // ✅ /saldo
      if (text === "/saldo") {
        const dados = await obterAfiliado(userId);
        const usuarios = await listarUsuarios();
        const indicados = usuarios.filter(u => u.convidado_por === userId);

        const premium = indicados.filter(i => i.plano === "premium").length;
        const basico = indicados.filter(i => i.plano === "basico").length;
        const gratuitos = indicados.filter(i => i.plano === "gratuito").length;

        const link = `https://t.me/Liderdigitalbot?start=${userId}`;

        await bot.sendMessage(chat.id, `💰 *Seu saldo atual:* R$${dados?.saldo?.toFixed(2) || 0}\n\n👥 *Seus indicados:*\n✨ Premium: ${premium}\n🔓 Básico: ${basico}\n🆓 Gratuito: ${gratuitos}\n\n📢 *Seu link de convite:*\n${link}`, {
          parse_mode: "Markdown"
        });
        return res.end();
      }

      // ✅ /saque (instrução)
      if (text === "/saque") {
        await bot.sendMessage(chat.id, `💰 *Solicitação de Saque*\n\nVocê pode sacar seu saldo acumulado a partir de *R$20,00* via Pix.\n\nPara solicitar, envie o comando no formato abaixo:\n\n\`/saque VALOR CHAVEPIX NOME\`\n\nExemplo:\n\`/saque 30.00 teste@pix.com.br Maria Silva\`\n\nO pagamento será feito em até 24 horas úteis.`, {
          parse_mode: "Markdown"
        });
        return res.end();
      }

      // ✅ /saque VALOR CHAVEPIX NOME
      if (text.startsWith("/saque ") && text.split(" ").length >= 4) {
        const partes = text.split(" ");
        const valor = partes[1];
        const chave = partes[2];
        const nomePix = partes.slice(3).join(" ");

        if (OWNER_ID) {
          await bot.sendMessage(OWNER_ID, `📤 *Solicitação de Saque*\n\n👤 @${from.username || "-"} (ID ${userId})\n💸 Valor: R$${valor}\n🔑 Chave Pix: ${chave}\n🧾 Nome: ${nomePix}`, { parse_mode: "Markdown" });
        }

        await bot.sendMessage(chat.id, `✅ Solicitação enviada com sucesso! Pagamento será feito em até 24 horas úteis.`);
        return res.end();
      }

      // ✅ /usuarios (somente para a dona)
      if (text === "/usuarios" && userId === OWNER_ID) {
        const todos = await listarUsuarios();
        await bot.sendMessage(chat.id, `👥 *Total de usuários:* ${todos.length}`, { parse_mode: "Markdown" });
        return res.end();
      }

      // ✅ /assinantes (somente para a dona)
      if (text === "/assinantes" && userId === OWNER_ID) {
        const todos = await listarUsuarios();
        const premium = todos.filter(u => u.plano === "premium").length;
        const basico = todos.filter(u => u.plano === "basico").length;
        const gratuitos = todos.filter(u => u.plano === "gratuito").length;

        await bot.sendMessage(chat.id, `✨ *Plano Premium:* ${premium}\n🔓 *Plano Básico:* ${basico}\n🆓 *Plano Gratuito:* ${gratuitos}`, { parse_mode: "Markdown" });
        return res.end();
      }

      // ✅ /zerarsaldo ID (apenas dona)
      if (text.startsWith("/zerarsaldo") && userId === OWNER_ID) {
        const id = Number(text.split(" ")[1]);
        if (!id) {
          await bot.sendMessage(chat.id, "❌ ID inválido. Use assim: /zerarsaldo ID");
          return res.end();
        }
        await zerarSaldo(id);
        await bot.sendMessage(chat.id, `✅ Saldo do ID ${id} zerado com sucesso.`);
        return res.end();
      }

      // ✅ /indicacoes ID (apenas admin)
      if (text.startsWith("/indicacoes") && userId === OWNER_ID) {
        const id = Number(text.split(" ")[1]);
        if (!id) {
          await bot.sendMessage(chat.id, "❌ *ID inválido. Use assim:*\n\n`/indicacoes ID`", { parse_mode: "Markdown" });
          return res.end();
        }

        const todos = await listarUsuarios();
        const indicados = todos.filter(u => u.convidado_por === id);
        const premium = indicados.filter(i => i.plano === "premium").length;
        const basico = indicados.filter(i => i.plano === "basico").length;
        const gratuitos = indicados.filter(i => i.plano === "gratuito").length;

        const usuario = await obterAfiliado(id);

        await bot.sendMessage(chat.id, `📈 *Estatísticas do ID* \`${id}\`\n\n👤 @${usuario?.username || "-"}\n\n✨ *Premium:* ${premium}\n🔓 *Básico:* ${basico}\n🆓 *Gratuito:* ${gratuitos}\n💸 *Saldo:* R$${usuario?.saldo?.toFixed(2) || 0}`, {
          parse_mode: "Markdown"
        });
        return res.end();
      }

      // ✅ Caso contrário, IA responde
      await bot.sendChatAction(chat.id, "typing");
      const resposta = await askGPT(text, userId);
      if (resposta) {
        await bot.sendMessage(chat.id, resposta, { parse_mode: "Markdown" });
      }
      return res.end();
    }

    // ✅ Botões inline
    if (update.callback_query) {
      await tratarCallbackQuery(bot, update.callback_query);
      return res.status(200).send("Callback tratado");
    }

  } catch (e) {
    console.error("❌ Erro no webhook:", e);
    const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;

    if (chatId) {
      await bot.sendMessage(chatId, `❌ Erro interno:\n\`${e.message}\``, {
        parse_mode: "Markdown"
      });
    }

    return res.status(500).send("Erro interno");
  }

  res.status(200).send("OK");
};
