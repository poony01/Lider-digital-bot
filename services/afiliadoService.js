// services/afiliadoService.js
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

// Zera saldo do afiliado
export async function zerarSaldo(userId) {
  if (!userId || isNaN(userId)) throw new Error("ID inválido");
  const { error } = await supabase
    .from("afiliados")
    .update({ saldo: 0 })
    .eq("user_id", userId);
  if (error) throw error;
}

// ✅ Salva plano temporário
export async function salvarPlanoTemporario(userId, plano) {
  await supabase
    .from("afiliados")
    .update({ plano_temp: plano })
    .eq("user_id", userId);
}

// ✅ Registra assinatura definitiva e dá recompensa
export async function registrarAssinatura(userId, tipoPlano) {
  const { data: usuario } = await supabase
    .from("afiliados")
    .select("convidado_por")
    .eq("user_id", userId)
    .single();

  // Atualiza plano
  await supabase
    .from("afiliados")
    .update({ plano: tipoPlano, plano_temp: null })
    .eq("user_id", userId);

  // Se foi indicado, recompensa o afiliado
  if (usuario?.convidado_por) {
    const valorComissao = tipoPlano === "premium" ? 11.45 : 7.45; // 50% do valor
    const { data: afiliado } = await supabase
      .from("afiliados")
      .select("saldo")
      .eq("user_id", usuario.convidado_por)
      .single();

    const novoSaldo = (afiliado?.saldo || 0) + valorComissao;

    await supabase
      .from("afiliados")
      .update({ saldo: novoSaldo })
      .eq("user_id", usuario.convidado_por);
  }
}
