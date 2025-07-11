import { bot } from "./index.js";
import { askGPT } from "./services/iaService.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";
import {
  salvarConvite,
  obterAfiliado,
  zerarSaldo,
  listarUsuarios
} from "./services/afiliadoService.js";

const OWNER_ID = Number(process.env.OWNER_ID);

bot.setMyCommands([
  { command: "start", description: "🚀 Iniciar bot" },
  { command: "limpar", description: "🧹 Limpar memória da IA" },
  { command: "convidar", description: "📢 Convidar amigos" },
  { command: "saldo", description: "💰 Ver saldo de comissões" },
  { command: "saque", description: "🏦 Solicitar saque por Pix" },
  ...(OWNER_ID
    ? [
        { command: "usuarios", description: "👥 Total de usuários" },
        { command: "assinantes", description: "✨ Planos ativos" },
        { command: "indicacoes", description: "📊 Ver afiliados por ID" },
        { command: "zerarsaldo", description: "❌ Zerar saldo" },
        { command: "broadcast", description: "📨 Enviar mensagem para todos" },
        { command: "enviar", description: "✉️ Enviar mensagem para ID específico" }
      ]
    : [])
]);

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot ativo");

  const update = req.body;

  try {
    if (update.callback_query) {
      await tratarCallbackQuery(bot, update.callback_query);
      return res.status(200).send("Callback ok");
    }

    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const userId = from.id;
      const username = from.username || "";
      const nome = from.first_name || "usuário";

      if (text.startsWith("/start")) {
        const indicadoPor = Number(text.split(" ")[1]);
        if (indicadoPor && indicadoPor !== userId) {
          await salvarConvite(userId, indicadoPor);
        }

        const mensagem = `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a *5 mensagens* para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n🎬 Geração de vídeos\n\n🗂️ Após atingir o limite, será necessário ativar um plano.\n\n*Escolha abaixo para desbloquear acesso completo:*`;

        const botoes = {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔍 Conhecer Plano Básico", callback_data: "ver_plano_basico" }],
              [{ text: "💎 Conhecer Plano Premium", callback_data: "ver_plano_premium" }]
            ]
          },
          parse_mode: "Markdown"
        };

        return await bot.sendMessage(chat.id, mensagem, botoes);
      }

      if (text === "/limpar") {
        return await bot.sendMessage(chat.id, "🧹 Memória limpa com sucesso!");
      }

      if (text === "/convidar") {
        const link = `https://t.me/${bot.username}?start=${userId}`;
        return await bot.sendMessage(chat.id, `📢 Compartilhe este link com amigos:\n\n${link}`);
      }

      if (text === "/saldo") {
        const afiliado = await obterAfiliado(userId);
        if (!afiliado) {
          return await bot.sendMessage(chat.id, "💰 Você ainda não indicou ninguém.");
        }

        const { saldo = 0 } = afiliado;
        return await bot.sendMessage(chat.id, `💰 Seu saldo atual é R$ ${saldo.toFixed(2)}`);
      }

      if (text.startsWith("/saque")) {
        const partes = text.split(" ");
        if (partes.length < 4) {
          return await bot.sendMessage(chat.id, "❗ Use o formato: /saque VALOR CHAVEPIX NOME");
        }

        const [_, valor, chavepix, ...nomeArray] = partes;
        const nomePix = nomeArray.join(" ");
        const msg = `📥 Solicitação de saque:\n\n👤 ID: ${userId}\n🔗 @${username}\n💸 Valor: R$ ${valor}\n🔑 Pix: ${chavepix}\n📛 Nome: ${nomePix}`;

        await bot.sendMessage(OWNER_ID, msg);
        return await bot.sendMessage(chat.id, "✅ Solicitação enviada. O pagamento será processado em até 24h úteis.");
      }

      if (text.startsWith("/zerarsaldo") && userId === OWNER_ID) {
        const partes = text.split(" ");
        const idParaZerar = Number(partes[1]);
        if (isNaN(idParaZerar)) {
          return await bot.sendMessage(chat.id, "❌ ID inválido.");
        }

        try {
          await zerarSaldo(idParaZerar);
          return await bot.sendMessage(chat.id, `✅ Saldo do ID ${idParaZerar} zerado.`);
        } catch (err) {
          console.error("Erro ao zerar saldo:", err);
          return await bot.sendMessage(chat.id, "❌ Erro ao zerar saldo.");
        }
      }

      if (text === "/usuarios" && userId === OWNER_ID) {
        const usuarios = await listarUsuarios();
        return await bot.sendMessage(chat.id, `👥 Total de usuários: ${usuarios.length}`);
      }

      // IA integrada (GPT-4 Turbo para Premium)
      const resposta = await askGPT(text, userId);
      if (resposta) {
        return await bot.sendMessage(chat.id, resposta, { parse_mode: "Markdown" });
      }

      return await bot.sendMessage(chat.id, "🤖 Desculpe, comando não reconhecido.");
    }

    return res.status(200).send("Sem ação");
  } catch (err) {
    console.error("Erro geral:", err);
    return res.status(500).send("Erro interno");
  }
};
