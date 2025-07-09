// services/afiliadoService.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Salvar convite quando novo usuário entra com link
export async function salvarConvite(novoId, convidadoPor) {
  await supabase.from("afiliados").upsert({
    user_id: novoId,
    convidado_por: convidadoPor,
    saldo: 0,
    plano: "gratuito"
  });
}

// Atualiza o plano do usuário e dá comissão para o afiliado
export async function registrarAssinatura(userId, plano) {
  const { data } = await supabase
    .from("afiliados")
    .select("convidado_por")
    .eq("user_id", userId)
    .single();

  await supabase.from("afiliados").update({ plano }).eq("user_id", userId);

  const valor = plano === "premium" ? 22.9 : plano === "basico" ? 14.9 : 0;
  const comissao = Math.floor((valor * 0.5) * 100) / 100;

  if (data?.convidado_por && comissao > 0) {
    await supabase.rpc("incrementar_saldo", {
      uid: data.convidado_por,
      valor: comissao
    });
  }
}

// Retorna saldo e convidados
export async function obterAfiliado(userId) {
  const { data } = await supabase
    .from("afiliados")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

// Lista todos afiliados com status
export async function listarUsuarios() {
  const { data } = await supabase.from("afiliados").select("*");
  return data;
}

// Zerar saldo após pagamento
export async function zerarSaldo(userId) {
  await supabase.from("afiliados").update({ saldo: 0 }).eq("user_id", userId);
}
