import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Salva o convite quando o usuário entra com link de outro
export async function salvarConvite(novoId, convidadoPor) {
  await supabase.from("afiliados").upsert({
    user_id: novoId,
    convidado_por: convidadoPor,
    saldo: 0,
    plano: "gratuito"
  });
}

// ✅ Atualiza plano e dá comissão pro afiliado
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

// ✅ Retorna info de um afiliado
export async function obterAfiliado(userId) {
  const { data } = await supabase
    .from("afiliados")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

// ✅ Retorna todos
export async function listarUsuarios() {
  const { data } = await supabase.from("afiliados").select("*");
  return data;
}

// ✅ Zera saldo
export async function zerarSaldo(userId) {
  await supabase.from("afiliados").update({ saldo: 0 }).eq("user_id", userId);
}
