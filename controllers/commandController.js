// controllers/commandController.js
import { getUser, createUser } from "../services/userService.js";
import { sendMessage } from "../services/telegramService.js";

export async function handleCommand(msg) {
  const chatId = msg.chat.id;
  const command = msg.text.trim().split(" ")[0];
  const name = msg.chat.first_name || "usuário(a)";

  const user = await getUser(chatId);
  if (!user) {
    await createUser(chatId);
  }

  switch (command) {
    case "/start":
      await sendMessage(chatId, `👋 Olá, ${name}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Você está no plano gratuito, com direito a *5 mensagens* para testar nossos recursos:\n\n🧠 *IA que responde perguntas*\n🖼️ *Geração de imagens com IA*\n🎙️ *Transcrição de áudios*\n\n💳 Após atingir o limite, será necessário ativar um plano.\n\n*Bom uso!* 😄`, { parse_mode: "Markdown" });
      break;

    case "/planos":
      await sendMessage(chatId, `💳 *Planos disponíveis:*\n\n🔹 *Plano Básico – R$14,90/mês*\nInclui:\n- IA para perguntas e respostas\n- Imagens simples\n- Transcrição de áudio\n\n🔸 *Plano Premium – R$22,90/mês*\nInclui:\n- Tudo do Básico\n- Imagens realistas e vídeos com IA\n- IA mais poderosa (GPT-4 Turbo)\n- Respostas mais longas e precisas\n\nPara assinar, envie */assinar*`, { parse_mode: "Markdown" });
      break;

    case "/assinar":
      await sendMessage(chatId, "✅ Em breve você poderá escolher seu plano e pagar via Pix com QR Code ou Pix copia e cola. Aguarde...");
      break;

    default:
      await sendMessage(chatId, "❌ Comando não reconhecido.");
  }
}
