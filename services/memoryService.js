// services/memoryService.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function getMemory(userId) {
  const { data, error } = await supabase
    .from("memorias")
    .select("mensagens")
    .eq("user_id", userId)
    .single();

  if (error || !data) return [];
  return data.mensagens || [];
}

export async function saveMemory(userId, mensagens) {
  const { error } = await supabase
    .from("memorias")
    .upsert({ user_id: userId, mensagens });

  if (error) {
    console.error("❌ Erro ao salvar memória no Supabase:", error);
  }
}

export async function limparMemoria(userId) {
  const { error } = await supabase
    .from("memorias")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Erro ao limpar memória:", error);
  }
}
