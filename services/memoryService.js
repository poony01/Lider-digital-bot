import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Busca o histórico e converte de JSON para array
export async function getMemory(userId) {
  const { data, error } = await supabase
    .from("memorias")
    .select("mensagens")
    .eq("user_id", userId)
    .single();

  if (error || !data) return [];

  try {
    return JSON.parse(data.mensagens || "[]");
  } catch {
    return [];
  }
}

// Salva o histórico convertido em string JSON
export async function saveMemory(userId, mensagens) {
  const mensagensString = JSON.stringify(mensagens);

  const { error } = await supabase
    .from("memorias")
    .upsert({ user_id: userId, mensagens: mensagensString });

  if (error) {
    console.error("❌ Erro ao salvar memória no Supabase:", error);
  }
}

// Limpa a memória do usuário
export async function limparMemoria(userId) {
  const { error } = await supabase
    .from("memorias")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Erro ao limpar memória:", error);
  }
}
