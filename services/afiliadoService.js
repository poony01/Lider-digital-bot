import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Salva convite do usuário
export async function salvarConvite(userId, indicadoPor) {
  const { data: existente } = await supabase
    .from("afiliados")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!existente) {
    await supabase.from("afiliados").insert([
      {
        user_id: userId,
        convidado_por: indicadoPor,
        plano: "gratuito",
        saldo: 0,
      },
    ]);
  }
}

// Lista todos os usuários
export async function listarUsuarios() {
  const { data, error } = await supabase.from("afiliados").select("*");
  if (error) throw error;
  return data;
}

// Obtém dados de um afiliado
export async function obterAfiliado(userId) {
  const { data, error } = await supabase
    .from("afiliados")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data;
}

// Atualiza saldo do afiliado
export async function atualizarSaldo(userId, novoSaldo) {
  return await supabase
    .from("afiliados")
    .update({ saldo: novoSaldo })
    .eq("user_id", userId);
}

// Zera saldo do afiliado – corrigido com proteção contra ID inválido
export async function zerarSaldo(userId) {
  if (!userId || isNaN(userId)) {
    throw new Error("ID inválido fornecido");
  }

  const { error } = await supabase
    .from("afiliados")
    .update({ saldo: 0 })
    .eq("user_id", userId);

  if (error) throw error;
}
