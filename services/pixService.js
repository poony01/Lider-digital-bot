import axios from "axios";
import { atualizarPlanoTemp } from "./afiliadoService.js";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const WEBHOOK_URL = "https://lider-digital-bot.vercel.app/api/pix";

// 👉 Função para gerar UUID manualmente (substitui pacote uuid)
function gerarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função principal para gerar cobrança Pix
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

    const idempotencyKey = gerarUUID();

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
      "X-Idempotency-Key": idempotencyKey
    };

    const response = await axios.post("https://api.mercadopago.com/v1/payments", body, { headers });

    // Salva plano temporário no Supabase
    await atualizarPlanoTemp(chatId, plano);

    const { id, point_of_interaction } = response.data;
    const copiaCola = point_of_interaction.transaction_data.qr_code;
    const qrCodeBase64 = point_of_interaction.transaction_data.qr_code_base64;

    return {
      id,
      valor: planoSelecionado.valor,
      plano: planoSelecionado.nome,
      copiaCola,
      qrCodeBase64
    };
  } catch (erro) {
    console.error("❌ Erro ao gerar cobrança Pix:", erro);
    throw erro;
  }
}
