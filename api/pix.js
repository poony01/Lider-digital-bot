// api/pix.js
import crypto from "crypto";
import { registrarAssinatura, obterAfiliado } from "../services/afiliadoService.js";

const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("✅ Webhook Pix ativo");
  }

  // 🔒 Validação da assinatura do Mercado Pago
  const signature = req.headers["x-signature"] || req.headers["X-Signature"];
  const rawBody = JSON.stringify(req.body);

  if (!signature || !MP_WEBHOOK_SECRET) {
    console.warn("⚠️ Assinatura ausente ou segredo não configurado.");
    return res.status(400).send("❌ Assinatura ausente ou configuração inválida.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", MP_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("⚠️ Assinatura inválida no webhook do Mercado Pago!");
    return res.status(401).send("❌ Assinatura inválida");
  }

  const notificacao = req.body;

  try {
    const status = notificacao?.data?.status;
    const metadata = notificacao?.data?.metadata;

    if (
      status === "approved" &&
      metadata?.user_id &&
      metadata?.plano
    ) {
      const userId = metadata.user_id;
      const plano = metadata.plano;

      const dados = await obterAfiliado(userId);

      if (dados?.plano !== plano) {
        await registrarAssinatura(userId, plano);
        console.log(`✅ Plano ${plano} ativado para o usuário ${userId}`);
      } else {
        console.log(`ℹ️ Usuário ${userId} já possui o plano ${plano}, ignorando duplicação.`);
      }

      return res.status(200).send("✅ Pagamento processado com sucesso");
    }

    console.log("ℹ️ Notificação recebida, mas ignorada (sem status aprovado ou metadados incompletos)");
    return res.status(200).send("ℹ️ Notificação ignorada");

  } catch (error) {
    console.error("❌ Erro no Webhook Pix:", error);
    return res.status(500).send("❌ Erro ao processar o pagamento");
  }
};
