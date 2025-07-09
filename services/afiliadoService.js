// services/afiliadoService.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 👉 Salvar convite quando novo usuário entra com link
export async function salvarConvite(novoId, convidadoPor) {
  await supabase.from("afiliados").upsert({
    user_id: novoId,
    convidado_por: convidadoPor,
    saldo: 0,
    plano: "gratuito"
  });
}

// ✅ Função chamada após pagamento do plano
export async function registrarPlanoERecompensa(userId, plano) {
  // Atualiza plano do usuário
  await supabase.from("afiliados").update({ plano }).eq("user_id", userId);

  // Verifica quem convidou o usuário
  const { data } = await supabase
    .from("afiliados")
    .select("convidado_por")
    .eq("user_id", userId)
    .single();

  const valor = plano === "premium" ? 22.9 : plano === "basico" ? 14.9 : 0;
  const comissao = Math.floor((valor * 0.5) * 100) / 100;

  if (data?.convidado_por && comissao > 0) {
    await supabase.rpc("incrementar_saldo", {
      uid: data.convidado_por,
      valor: comissao
    });
  }
}

// 📊 Retorna dados de um afiliado (saldo, plano, etc.)
export async function obterAfiliado(userId) {
  const { data } = await supabase
    .from("afiliados")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

// 👥 Lista todos os usuários registrados
export async function listarUsuarios() {
  const { data } = await supabase.from("afiliados").select("*");
  return data;
}

// 💸 Zerar saldo após pagamento manual
export async function zerarSaldo(userId) {
  await supabase.from("afiliados").update({ saldo: 0 }).eq("user_id", userId);
}
