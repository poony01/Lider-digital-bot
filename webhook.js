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

// Comandos do menu
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

export default async (req, res) => {
  if (req.method !== "POST") return res.status(200).send("🤖 Bot ativo");

  const update = req.body;

  try {
    // === BOTÃO: Callback de planos ===
    if (update.callback_query) {
      const query = update.callback_query;
      const userId = query.from.id;
      const chatId = query.message.chat.id;
      const msgId = query.message.message_id;

      const planoBasicoTexto = `📘 *Plano Básico – R$14,90/mês*\n\n✅ Acesso ao modelo *GPT-3.5 Turbo* para responder perguntas inteligentes.\n🧠 Geração de imagens profissionais com IA.\n📝 Transcrição de áudios.\n🎞️ Geração de vídeos curtos com base em texto.`;
      const planoPremiumTexto = `📙 *Plano Premium – R$22,90/mês*\n\n🚀 Acesso ao modelo *GPT-4 Turbo*, o mais avançado da OpenAI.\n📸 Criação de imagens realistas e profissionais com IA.\n🎙️ Transcrição de áudios ilimitada.\n🎬 Criação de vídeos longos com base em textos e imagens.`;

      if (query.data === "ver_basico") {
        await bot.deleteMessage(chatId, msgId);
        return await bot.sendMessage(chatId, planoBasicoTexto, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "💳 Assinar Plano – R$14,90", callback_data: "assinar_basico" }],
              [{ text: "🔙 Voltar", callback_data: "voltar_planos" }],
            ],
          },
        });
      }

      if (query.data === "ver_premium") {
        await bot.deleteMessage(chatId, msgId);
        return await bot.sendMessage(chatId, planoPremiumTexto, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "💳 Assinar Plano – R$22,90", callback_data: "assinar_premium" }],
              [{ text: "🔙 Voltar", callback_data: "voltar_planos" }],
            ],
          },
        });
      }

      if (query.data === "voltar_planos") {
        await bot.deleteMessage(chatId, msgId);
        return await bot.sendMessage(chatId, `Escolha abaixo para desbloquear acesso completo:`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "📘 Conhecer Plano Básico", callback_data: "ver_basico" }],
              [{ text: "📙 Conhecer Plano Premium", callback_data: "ver_premium" }],
            ],
          },
        });
      }

      if (query.data === "assinar_basico" || query.data === "assinar_premium") {
        const plano = query.data === "assinar_basico" ? "basico" : "premium";
        await bot.deleteMessage(chatId, msgId);

        try {
          const { copiaCola, qrCodeBase64, valor, plano: nomePlano } = await gerarCobrancaPix(userId, plano);

          return await bot.sendPhoto(chatId, qrCodeBase64, {
            caption: `💳 *${nomePlano}*\n\nValor: R$ ${valor.toFixed(2)}\n\n🔁 Copie o código Pix abaixo para pagamento:\n\`\`\`\n${copiaCola}\n\`\`\``,
            parse_mode: "Markdown",
          });
        } catch (err) {
          return await bot.sendMessage(chatId, "❌ Erro ao gerar o Pix. Tente novamente mais tarde.");
        }
      }

      return await tratarCallbackQuery(bot, query); // mantém outras funções
    }

    // === COMANDOS ===
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

        const mensagem = `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano *gratuito*, com direito a 5 mensagens para testar:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n🎬 Geração de vídeos\n\n📌 Após atingir o limite, será necessário ativar um plano.\n\nEscolha abaixo para desbloquear acesso completo:`;

        return await bot.sendMessage(chat.id, mensagem, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📘 Conhecer Plano Básico", callback_data: "ver_basico" }],
              [{ text: "📙 Conhecer Plano Premium", callback_data: "ver_premium" }],
            ],
          },
        });
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
        const nomeCompleto = nomeArray.join(" ");
        const msg = `📥 Solicitação de saque:\n\n👤 ID: ${userId}\n🔗 @${username}\n💸 Valor: R$ ${valor}\n🔑 Pix: ${chavepix}\n📛 Nome: ${nomeCompleto}`;

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

      // Integração com IA
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
