// /api/pix.js
import { registrarPlanoERecompensa } from "../../services/pixService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  try {
    const evento = req.body;

    // ⚠️ Verifica se é um pagamento aprovado via PIX
    if (
      evento?.type === "payment" &&
      evento?.data?.id
    ) {
      const paymentId = evento.data.id;

      // Buscar detalhes da transação no Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      });

      const pagamento = await response.json();

      // Só processa se estiver aprovado
      if (pagamento.status === "approved" && pagamento.payment_method_id === "pix") {
        const userId = pagamento.metadata?.user_id;
        const tipoPlano = pagamento.metadata?.plano;

        if (userId && tipoPlano) {
          await registrarPlanoERecompensa(userId, tipoPlano);
          return res.status(200).send("✅ Pagamento processado com sucesso.");
        }
      }

      return res.status(200).send("🔁 Pagamento não aprovado ou incompleto.");
    }

    res.status(200).send("📩 Webhook recebido.");
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    res.status(500).send("Erro interno ao processar o webhook.");
  }
}
