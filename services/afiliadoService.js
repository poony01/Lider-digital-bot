// services/afiliadoService.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Salva convite do usuário (evita duplicidade)
export async function salvarConvite(userId, indicadoPor) {
  const { data: existente, error } = await supabase
    .from("afiliados")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Erro ao verificar afiliado:", error);
    return;
  }

  if (!existente) {
    await supabase.from("afiliados").insert([
      {
        user_id: userId,
        convidado_por: indicadoPor,
        plano: "gratuito",
        saldo: 0,
        mensagens: 0
      }
    ]);
  }
}

// Lista todos os usuários
export async function listarUsuarios() {
  const { data, error } = await supabase.from("afiliados").select("*");
  if (error) {
    console.error("Erro ao listar usuários:", error);
    return [];
  }
  return data;
}

// Obtém dados de um afiliado
export async function obterAfiliado(userId) {
  const { data, error } = await supabase
    .from("afiliados")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.warn("Afiliado não encontrado:", error.message);
    return null;
  }

  return data;
}

// Atualiza saldo do afiliado
export async function atualizarSaldo(userId, novoSaldo) {
  const { error } = await supabase
    .from("afiliados")
    .update({ saldo: novoSaldo })
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao atualizar saldo:", error);
  }
}

// Zera saldo do afiliado
export async function zerarSaldo(userId) {
  if (!userId || isNaN(userId)) throw new Error("ID inválido");
  const { error } = await supabase
    .from("afiliados")
    .update({ saldo: 0 })
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao zerar saldo:", error);
    throw error;
  }
}

// ✅ Salva plano temporário (antes de pagar)
export async function salvarPlanoTemporario(userId, plano) {
  const { error } = await supabase
    .from("afiliados")
    .update({ plano_temp: plano })
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao salvar plano temporário:", error);
  }
}

// ✅ Registra assinatura e recompensa o afiliado (se houver)
export async function registrarAssinatura(userId, tipoPlano) {
  const { data: usuario, error: erroBuscar } = await supabase
    .from("afiliados")
    .select("convidado_por")
    .eq("user_id", userId)
    .single();

  if (erroBuscar) {
    console.error("Erro ao buscar usuário:", erroBuscar);
    return;
  }

  // Atualiza o plano do usuário
  await supabase
    .from("afiliados")
    .update({ plano: tipoPlano, plano_temp: null })
    .eq("user_id", userId);

  // Se foi indicado, atualiza saldo do afiliado com comissão
  if (usuario?.convidado_por) {
    const valorComissao = tipoPlano === "premium" ? 11.45 : 7.45;

    const { data: afiliado, error: erroAfiliado } = await supabase
      .from("afiliados")
      .select("saldo")
      .eq("user_id", usuario.convidado_por)
      .single();

    if (erroAfiliado) {
      console.error("Erro ao buscar afiliado para comissão:", erroAfiliado);
      return;
    }

    const novoSaldo = (afiliado?.saldo || 0) + valorComissao;

    await supabase
      .from("afiliados")
      .update({ saldo: novoSaldo })
      .eq("user_id", usuario.convidado_por);
  }
}
