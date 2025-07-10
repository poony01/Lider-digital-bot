// services/afiliadoService.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Salva um novo usuário afiliado (se ainda não existir)
 */
export async function salvarConvite(userId, indicadoPor) {
  const { data: existente, error: erroBusca } = await supabase
    .from("afiliados")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (erroBusca) console.error("Erro ao buscar afiliado:", erroBusca);

  if (!existente) {
    const { error: erroInsercao } = await supabase.from("afiliados").insert([
      {
        user_id: userId,
        convidado_por: indicadoPor,
        plano: "gratuito",
        saldo: 0,
      },
    ]);

    if (erroInsercao) {
      console.error("Erro ao salvar convite:", erroInsercao);
      throw erroInsercao;
    }
  }
}

/**
 * Lista todos os usuários afiliados
 */
export async function listarUsuarios() {
  const { data, error } = await supabase.from("afiliados").select("*");
  if (error) throw error;
  return data;
}

/**
 * Retorna os dados de um afiliado pelo ID
 */
export async function obterAfiliado(userId) {
  const { data, error } = await supabase
    .from("afiliados")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Atualiza o saldo do afiliado
 */
export async function atualizarSaldo(userId, novoSaldo) {
  if (!userId || isNaN(userId)) throw new Error("ID inválido");
  return await supabase
    .from("afiliados")
    .update({ saldo: novoSaldo })
    .eq("user_id", userId);
}

/**
 * Zera o saldo do afiliado com proteção
 */
export async function zerarSaldo(userId) {
  if (!userId || isNaN(userId)) {
    throw new Error("ID inválido fornecido");
  }

  const { error } = await supabase
    .from("afiliados")
    .update({ saldo: 0 })
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao zerar saldo:", error);
    throw error;
  }
}
