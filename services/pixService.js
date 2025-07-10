import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export async function gerarCobrancaPix(userId, plano, valor) {
  try {
    const idempotencyKey = uuidv4(); // chave única

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: valor,
        description: plano === "premium" ? "Plano Premium" : "Plano Básico",
        payment_method_id: "pix",
        notification_url: "https://lider-digital-bot.vercel.app/api/pix",
        payer: {
          email: `user${userId}@example.com`,
        },
        metadata: {
          user_id: userId,
          plano,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao gerar cobrança Pix:", error);
    throw new Error("Erro ao gerar o Pix. Tente novamente mais tarde.");
  }
}
