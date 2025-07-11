import { bot } from "./index.js";
import { askGPT } from "./services/iaService.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";
import {
  salvarConvite,
  obterAfiliado,
  zerarSaldo,
  listarUsuarios,
} from "./services/afiliadoService.js";
import { gerarCobrancaPix } from "./services/pixService.js";

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
        { command: "enviar", description: "✉️ Enviar mensagem para ID específico" },
      ]
    : []),
]);

bot.onText(/\/start/, async (msg) => {
  const { id: chatId } = msg.chat;
  const userId = msg.from.id;
  const nome = msg.from.first_name || "usuário";
  const indicadoPor = Number(msg.text.split(" ")[1]);

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
        [{ text: "💎 Conhecer Plano Premium", callback_data: "ver_plano_premium" }],
      ],
    },
    parse_mode: "Markdown",
  };

  return await bot.sendMessage(chat.id, mensagem, botoes);
} 

  await bot.sendMessage(chatId, texto, opcoes);
});

bot.on("callback_query", async (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  // Apaga mensagem anterior
  await bot.deleteMessage(chatId, messageId).catch(() => {});

  if (data === "plano_basico_info") {
    const texto = `📘 *Plano Básico* — *R$14,90*

✅ IA com ChatGPT 3.5 Turbo  
✅ Geração de imagens profissionais por comando  
✅ Atendimento rápido e sem filas  
✅ Acesso imediato após o pagamento

Toque em *Assinar* para receber o Pix`;

    const botoes = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💳 Assinar Plano Básico — R$14,90", callback_data: "assinar_basico" }],
          [{ text: "🔙 Voltar", callback_data: "voltar_inicio" }],
        ],
      },
      parse_mode: "Markdown",
    };

    return await bot.sendMessage(chatId, texto, botoes);
  }

  if (data === "plano_premium_info") {
    const texto = `📙 *Plano Premium* — *R$22,90*

🔥 Acesso completo ao GPT-4 Turbo  
🎥 Criação de vídeos com inteligência artificial  
🖼️ Transformação de textos e imagens em vídeos  
✅ Tudo incluso do Plano Básico

Toque em *Assinar* para receber o Pix`;

    const botoes = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💳 Assinar Plano Premium — R$22,90", callback_data: "assinar_premium" }],
          [{ text: "🔙 Voltar", callback_data: "voltar_inicio" }],
        ],
      },
      parse_mode: "Markdown",
    };

    return await bot.sendMessage(chatId, texto, botoes);
  }

  if (data === "voltar_inicio") {
    const texto = `👋 Escolha uma das opções abaixo para conhecer os planos:`;
    const opcoes = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📘 Conhecer Plano Básico", callback_data: "plano_basico_info" },
            { text: "📙 Conhecer Plano Premium", callback_data: "plano_premium_info" },
          ],
        ],
      },
      parse_mode: "Markdown",
    };

    return await bot.sendMessage(chatId, texto, opcoes);
  }

  if (data === "assinar_basico") {
    const cobranca = await gerarCobrancaPix(chatId, "basico");
    const texto = `💳 *Pagamento Pix — Plano Básico*

📌 Valor: *R$${cobranca.valor}*  
📎 Copie o código abaixo para pagar no app do seu banco:  
\`\`\`${cobranca.copiaCola}\`\`\``;

    const opcoes = {
      reply_markup: {
        inline_keyboard: [[{ text: "🔙 Voltar", callback_data: "voltar_inicio" }]],
      },
      parse_mode: "Markdown",
    };

    await bot.sendPhoto(chatId, Buffer.from(cobranca.qrCodeBase64, "base64"), {
      caption: texto,
      ...opcoes,
    });
  }

  if (data === "assinar_premium") {
    const cobranca = await gerarCobrancaPix(chatId, "premium");
    const texto = `💳 *Pagamento Pix — Plano Premium*

📌 Valor: *R$${cobranca.valor}*  
📎 Copie o código abaixo para pagar no app do seu banco:  
\`\`\`${cobranca.copiaCola}\`\`\``;

    const opcoes = {
      reply_markup: {
        inline_keyboard: [[{ text: "🔙 Voltar", callback_data: "voltar_inicio" }]],
      },
      parse_mode: "Markdown",
    };

    await bot.sendPhoto(chatId, Buffer.from(cobranca.qrCodeBase64, "base64"), {
      caption: texto,
      ...opcoes,
    });
  }

  await bot.answerCallbackQuery(query.id);
});

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot ativo");

  const update = req.body;
  try {
    if (update.callback_query) {
      await tratarCallbackQuery(bot, update.callback_query);
      return res.status(200).send("Callback OK");
    }

    if (update.message && update.message.text) {
      const { chat, text, from } = update.message;
      const userId = from.id;

      // comandos: /limpar, /convidar, /saldo, /saque, /usuarios, etc
      // já estão no código anterior

      const dados = await obterAfiliado(userId);
      const plano = dados?.plano;

      if (!plano || plano === "gratuito") {
        return await bot.sendMessage(chat.id, "😔 Desculpe, a IA está disponível apenas para assinantes.");
      }

      const resposta = await askGPT(text, userId);
      if (resposta) {
        return await bot.sendMessage(chat.id, resposta, { parse_mode: "Markdown" });
      }

      return await bot.sendMessage(chat.id, "🤖 Comando não reconhecido.");
    }

    return res.status(200).send("Sem ação");
  } catch (err) {
    console.error("Erro geral:", err);
    return res.status(500).send("Erro interno");
  }
};
