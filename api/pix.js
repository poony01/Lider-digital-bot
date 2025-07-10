// api/pix.js
import { registrarAssinatura, obterAfiliado } from "../services/afiliadoService.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("✅ Webhook Pix ativo");
  }

  const notificacao = req.body;

  try {
    // Verifica se é pagamento aprovado
    const status = notificacao?.data?.status;
    const metadata = notificacao?.data?.metadata;

    if (status === "approved" && metadata?.user_id && metadata?.plano) {
      const userId = metadata.user_id;
      const plano = metadata.plano;

      // Verifica se o plano já foi registrado (evita duplicações)
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
