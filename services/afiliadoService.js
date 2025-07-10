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

// Atualiza plano e dá comissão pro afiliado
export async function registrarAssinatura(userId, plano) {
  const { data, error } = await supabase
    .from("afiliados")
    .select("convidado_por")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("❌ Erro ao buscar afiliado:", error);
    return;
  }

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

// Retorna dados de um afiliado
export async function obterAfiliado(userId) {
  const { data, error } = await supabase
    .from("afiliados")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("❌ Erro ao obter afiliado:", error);
    return null;
  }

  return data;
}

// Retorna todos os afiliados como lista
export async function listarUsuarios() {
  const { data, error } = await supabase.from("afiliados").select("*");

  if (error) {
    console.error("❌ Erro ao listar usuários:", error);
    return [];
  }

  return data || [];
}

// Zera o saldo de um afiliado
export async function zerarSaldo(userId) {
  const { error } = await supabase
    .from("afiliados")
    .update({ saldo: 0 })
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Erro ao zerar saldo:", error);
  }
}
