import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Obtém o histórico salvo do usuário
export async function getMemory(userId) {
  const { data, error } = await supabase
    .from("memorias")
    .select("mensagens")
    .eq("user_id", userId)
    .single();

  if (error || !data) return [];
  return data.mensagens || [];
}

// Salva o histórico atualizado do usuário
export async function saveMemory(userId, mensagens) {
  const { error } = await supabase
    .from("memorias")
    .upsert({ user_id: userId, mensagens });

  if (error) {
    console.error("Erro ao salvar memória no Supabase:", error);
  }
}
