// api/pix.js
import crypto from "crypto";
import { registrarAssinatura, obterAfiliado } from "../services/afiliadoService.js";

const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("✅ Webhook Pix ativo");
  }

  // 🔒 Verifica assinatura do Mercado Pago
  const signature = req.headers["x-signature"];
  const rawBody = JSON.stringify(req.body);
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

    if (status === "approved" && metadata?.user_id && metadata?.plano) {
      const userId = metadata.user_id;
      const plano = metadata.plano;

      const dados = await obterAfiliado(userId);
      if (dados?.plano !== plano) {
        await registrarAssinatura(userId, plano);
        console.log(`✅ Plano ${plano} ativado para o usuário ${userId}`);
      } else {
        console.log(`⚠️ Usuário ${userId} já está no plano ${plano}, ignorando duplicação.`);
      }

      return res.status(200).send("✅ Pagamento processado com sucesso");
    }

    return res.status(200).send("ℹ️ Notificação ignorada (sem aprovação ou dados incompletos)");

  } catch (e) {
    console.error("❌ Erro no Webhook Pix:", e.message);
    return res.status(500).send("❌ Erro no processamento do Pix");
  }
};
