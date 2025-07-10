// services/pixService.js
import axios from "axios";
import { registrarAssinatura } from "./afiliadoService.js";

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN; // Ex: APP_USR-xxxxxxxxx
const WEBHOOK_URL = "https://lider-digital-bot.vercel.app/api/pix"; // Já incluído na config
const planos = {
  basico: {
    nome: "Plano Básico",
    valor: 14.9,
    texto: `✅ *Plano Básico – R$14,90/mês*\n\n• IA para perguntas e respostas\n• Geração de imagens simples\n• Transcrição de áudios\n• Suporte básico\n\nApós o pagamento, o plano será ativado automaticamente.`,
  },
  premium: {
    nome: "Plano Premium",
    valor: 22.9,
    texto: `🌟 *Plano Premium – R$22,90/mês*\n\n• Tudo do Plano Básico, mais:\n• Geração de vídeos com IA\n• Imagens realistas avançadas\n• Respostas mais longas\n• Suporte prioritário\n\nApós o pagamento, o plano será ativado automaticamente.`,
  },
};

// ✅ Gerar cobrança Pix no Mercado Pago
export async function gerarCobrancaPix(tipoPlano, userId) {
  const plano = planos[tipoPlano];
  if (!plano) throw new Error("Plano inválido");

  const body = {
    transaction_amount: plano.valor,
    description: plano.nome,
    payment_method_id: "pix",
    notification_url: WEBHOOK_URL,
    payer: {
      email: `user${userId}@example.com` // Fictício, obrigatório no MP
    },
    metadata: {
      user_id: userId,
      plano: tipoPlano
    }
  };

  const { data } = await axios.post("https://api.mercadopago.com/v1/payments", body, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  const codigoPix = data.point_of_interaction.transaction_data.qr_code;
  const imagemQrcode = data.point_of_interaction.transaction_data.qr_code_base64;

  return {
    texto: plano.texto,
    codigoPix,
    imagemUrl: `data:image/png;base64,${imagemQrcode}`
  };
}

// ✅ Registrar plano e comissão após pagamento confirmado via webhook
export async function registrarPlanoERecompensa(userId, tipoPlano) {
  await registrarAssinatura(userId, tipoPlano);
}
