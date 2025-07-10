import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase.js";

const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const WEBHOOK_URL = "https://lider-digital-bot.vercel.app/api/pix"; // sua URL de produção

export async function gerarCobrancaPix(chatId, plano) {
  try {
    const planos = {
      basico: { valor: 14.9, nome: "Plano Básico" },
      premium: { valor: 29.9, nome: "Plano Premium" },
    };

    if (!planos[plano]) {
      throw new Error("Plano inválido.");
    }

    const { valor, nome } = planos[plano];

    const idempotencyKey = uuidv4(); // 🔑 Gera chave única obrigatória

    const pagamento = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: valor,
        description: nome,
        payment_method_id: "pix",
        notification_url: WEBHOOK_URL,
        payer: {
          email: `user${chatId}@example.com`,
        },
        metadata: {
          user_id: chatId,
          plano,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${MP_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey, // ✅ cabeçalho necessário
        },
      }
    );

    const { id, point_of_interaction } = pagamento.data;
    const copiaECola = point_of_interaction.transaction_data.qr_code;
    const qrCode = point_of_interaction.transaction_data.qr_code_base64;

    // 🔁 Salva plano temporário no Supabase
    await supabase
      .from("afiliados")
      .update({ plano_temp: plano, id_pagamento: id })
      .eq("id", chatId);

    return { copiaECola, qrCode };
  } catch (erro) {
    console.error("❌ Erro ao gerar cobrança Pix:", erro);
    throw new Error("Erro ao gerar cobrança Pix.");
  }
}
