// services/memoryService.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getMemory(userId) {
  try {
    const { data, error } = await supabase
      .from('memorias')
      .select('mensagens')
      .eq('user_id', userId)
      .single();

    if (error || !data) return [];
    return data.mensagens || [];
  } catch (e) {
    console.error("Erro ao buscar memória:", e);
    return [];
  }
}

export async function saveMemory(userId, mensagens) {
  try {
    // Tenta atualizar primeiro
    const { error: updateError } = await supabase
      .from('memorias')
      .update({ mensagens })
      .eq('user_id', userId);

    if (updateError) {
      // Se não atualizou, tenta inserir
      const { error: insertError } = await supabase
        .from('memorias')
        .insert([{ user_id: userId, mensagens }]);

      if (insertError) {
        console.error("Erro ao salvar memória:", insertError);
      }
    }
  } catch (e) {
    console.error("Erro ao salvar memória:", e);
  }
}
