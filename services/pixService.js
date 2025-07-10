import axios from "axios";
import { atualizarPlanoTemp } from "./afiliadoService.js";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const WEBHOOK_URL = "https://lider-digital-bot.vercel.app/api/pix";

// Gera UUID válido (sem pacote uuid)
function gerarUUID() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function gerarCobrancaPix(chatId, plano) {
  try {
    const planos = {
      basico: { valor: 14.90, nome: "Plano Básico" },
      premium: { valor: 29.90, nome: "Plano Premium" }
    };

    const planoSelecionado = planos[plano];
    if (!planoSelecionado) {
      throw new Error("Plano inválido");
    }

    const idempotencyKey = gerarUUID(); // ✅ GARANTIDO QUE NUNCA É NULO

    const body = {
      transaction_amount: planoSelecionado.valor,
      description: planoSelecionado.nome,
      payment_method_id: "pix",
      notification_url: WEBHOOK_URL,
      payer: {
        email: `user${chatId}@example.com`
      },
      metadata: {
        user_id: chatId,
        plano: plano
      }
    };

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
      "X-Idempotency-Key": idempotencyKey  // ✅ AGORA ENVIADO CERTO
    };

    const response = await axios.post("https://api.mercadopago.com/v1/payments", body, { headers });

    await atualizarPlanoTemp(chatId, plano);

    const { point_of_interaction } = response.data;
    return {
      copiaCola: point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: point_of_interaction.transaction_data.qr_code_base64,
      valor: planoSelecionado.valor,
      plano: planoSelecionado.nome
    };
  } catch (erro) {
    console.error("❌ Erro ao gerar cobrança Pix:", erro);
    throw erro;
  }
}
