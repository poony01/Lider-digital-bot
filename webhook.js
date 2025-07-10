// webhook.js
import { bot } from "./index.js";
import { askGPT } from "./services/iaService.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";
import { limparMemoria } from "./services/memoryService.js";
import {
  salvarConvite,
  obterAfiliado,
  zerarSaldo,
  listarUsuarios,
} from "./services/afiliadoService.js";

const OWNER_ID = Number(process.env.OWNER_ID);
const OWNER_USERNAME = process.env.OWNER_USERNAME);

// Comandos personalizados com emojis
const comandosUsuarios = [
  { command: "start", description: "🚀 Iniciar bot" },
  { command: "limpar", description: "🧹 Limpar memória da IA" },
  { command: "convidar", description: "📢 Convidar amigos" },
  { command: "saldo", description: "💰 Ver saldo de comissões" },
  { command: "saque", description: "🏦 Solicitar saque por Pix" },
];

const comandosAdmin = [
  { command: "usuarios", description: "👥 Total de usuários" },
  { command: "assinantes", description: "✨ Planos ativos" },
  { command: "indicacoes", description: "📊 Ver afiliados por ID" },
  { command: "zerarsaldo", description: "❌ Zerar saldo" },
  { command: "broadcast", description: "📨 Enviar mensagem para todos" },
  { command: "enviar", description: "✉️ Enviar mensagem para ID" }
];

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot online");

  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const nome = from?.first_name || "usuário";
      const userId = from.id;

      // Define comandos por tipo de usuário
      const comandos = [...comandosUsuarios];
      if (userId === OWNER_ID) comandos.push(...comandosAdmin);
      await bot.setMyCommands(comandos);

      // /start com indicação
      if (text.startsWith("/start ") && !isNaN(Number(text.split(" ")[1]))) {
        const indicadoPor = Number(text.split(" ")[1]);
        if (indicadoPor !== userId) await salvarConvite(userId, indicadoPor);
      }

      // /start normal
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

      if (text === "/limpar") {
        await limparMemoria(userId);
        await bot.sendMessage(chat.id, "🧹 Sua memória foi limpa com sucesso!");
        return res.end();
      }

      if (text === "/convidar") {
        const link = `https://t.me/${bot.username}?start=${userId}`;
        await bot.sendMessage(chat.id, `📢 Convide amigos com este link:\n${link}`);
        return res.end();
      }

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

      // ADMINISTRADOR
      if (userId === OWNER_ID) {
        if (text === "/usuarios") {
          const todos = await listarUsuarios();
          await bot.sendMessage(chat.id, `👥 Total de usuários: ${todos.length}`);
          return res.end();
        }

        if (text === "/assinantes") {
          const todos = await listarUsuarios();
          const premium = todos.filter(u => u.plano === "premium").length;
          const basico = todos.filter(u => u.plano === "basico").length;
          const gratuitos = todos.filter(u => u.plano === "gratuito").length;

          await bot.sendMessage(chat.id, `✨ Plano Premium: ${premium}
🔓 Plano Básico: ${basico}
🆓 Gratuito: ${gratuitos}`);
          return res.end();
        }

        if (text.startsWith("/indicacoes")) {
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

        if (text.startsWith("/zerarsaldo")) {
          const id = Number(text.split(" ")[1]);
          await zerarSaldo(id);
          return await bot.sendMessage(chat.id, `✅ Saldo do ID ${id} zerado.`);
        }

        if (text.startsWith("/broadcast ")) {
          const mensagem = text.replace("/broadcast ", "");
          const todos = await listarUsuarios();
          for (const u of todos) {
            try {
              await bot.sendMessage(u.id, mensagem);
            } catch (e) {
              console.log("Erro ao enviar broadcast para ID", u.id);
            }
          }
          return await bot.sendMessage(chat.id, `📨 Mensagem enviada para todos os usuários.`);
        }

        if (text.startsWith("/enviar ")) {
          const partes = text.split(" ");
          const id = Number(partes[1]);
          const msg = partes.slice(2).join(" ");
          await bot.sendMessage(id, msg);
          return await bot.sendMessage(chat.id, `✉️ Mensagem enviada para o ID ${id}`);
        }
      }

      // Detecta termos sobre ganhar dinheiro
      if (/ganhar dinheiro|renda extra|indicar|indicação|comissão/gi.test(text)) {
        const link = `https://t.me/${bot.username}?start=${userId}`;
        await bot.sendMessage(chat.id, `💸 Quer ganhar dinheiro com o bot?

Indique amigos usando seu link único:
${link}

Você ganha *50%* da primeira assinatura de cada indicado! 🔥`);
        return res.end();
      }

      // Resposta da IA
      await bot.sendChatAction(chat.id, "typing");
      const resposta = await askGPT(text, userId);
      await bot.sendMessage(chat.id, resposta, { parse_mode: "Markdown" });
      return res.end();
    }

    // Inline buttons
    if (update.callback_query) {
      await tratarCallbackQuery(bot, update.callback_query);
      return res.status(200).send("Callback tratado");
    }

  } catch (e) {
    console.error("❌ Erro no webhook:", e);
    const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;

    if (chatId) {
      try {
        await bot.sendMessage(chatId, `❌ Erro interno:\n\`${e.message}\``, {
          parse_mode: "Markdown"
        });
      } catch (erro) {
        console.error("Erro ao notificar usuário:", erro.message);
      }
    }

    return res.status(500).send("Erro interno");
  }

  res.status(200).send("OK");
};
