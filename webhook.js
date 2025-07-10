// webhook.js
import { bot } from "./index.js";
import { salvarConvite } from "./services/afiliadoService.js";
import { tratarCallbackQuery } from "./controllers/callbackController.js";
import { limparMemoria } from "./services/memoryService.js";
import { askGPT } from "./services/iaService.js";

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
        const { obterAfiliado, listarUsuarios } = await import("./services/afiliadoService.js");
        const dados = await obterAfiliado(userId);
        const usuarios = await listarUsuarios();
        const indicados = usuarios.filter(u => u.convidado_por === userId);

        const premium = indicados.filter(i => i.plano === "premium").length;
        const basico = indicados.filter(i => i.plano === "basico").length;
        const gratuitos = indicados.filter(i => i.plano === "gratuito").length;

        const link = `https://t.me/Liderdigitalbot?start=${userId}`;

        const msg = `💰 *Seu saldo:* R$${(dados?.saldo || 0).toFixed(2)}

👥 *Seus indicados:*
• Premium: ${premium}
• Básico: ${basico}
• Gratuito: ${gratuitos}

📢 *Link de convite:*
${link}`;

        await bot.sendMessage(chat.id, msg, { parse_mode: "Markdown" });
        return res.end();
      }

      // ✅ /saque (instruções)
      if (text === "/saque") {
        const mensagem = `💰 *Solicitação de Saque*

Você pode sacar seu saldo acumulado a partir de *R$20,00* via Pix.

Para solicitar, envie o comando no formato abaixo:

\`/saque VALOR CHAVEPIX NOME\`

Exemplo:
\`/saque 30.00 teste@pix.com.br Maria Silva\`

O pagamento será feito em até *24 horas úteis*`;

        await bot.sendMessage(chat.id, mensagem, { parse_mode: "Markdown" });
        return res.end();
      }

      // ✅ /saque VALOR CHAVEPIX NOME
      if (text.startsWith("/saque ") && text.split(" ").length >= 4) {
        const partes = text.split(" ");
        const valor = partes[1];
        const chave = partes[2];
        const nomePix = partes.slice(3).join(" ");

        const msgAdmin = `📤 *Solicitação de Saque*

👤 @${from.username || "-"} (ID ${userId})
💸 Valor: R$${valor}
🔑 Chave Pix: ${chave}
🧾 Nome: ${nomePix}`;

        if (process.env.OWNER_ID) {
          await bot.sendMessage(Number(process.env.OWNER_ID), msgAdmin, { parse_mode: "Markdown" });
        }

        await bot.sendMessage(chat.id, `✅ Solicitação enviada com sucesso! O pagamento será feito em até *24 horas úteis*.`, {
          parse_mode: "Markdown"
        });

        return res.end();
      }

      // ✅ Se não for comando, responde com IA
      await bot.sendChatAction(chat.id, "typing");
      const resposta = await askGPT(text, userId);
      if (resposta) {
        await bot.sendMessage(chat.id, resposta, { parse_mode: "Markdown" });
      }

      return res.end();
    }

    // ✅ Trata botões inline
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
