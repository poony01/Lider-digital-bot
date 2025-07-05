// services/userService.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function getUser(chat_id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('chat_id', chat_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao buscar usuário:", error.message);
    return null;
  }

  return data;
}

export async function createUser(userData) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([userData]);

  if (error) {
    console.error("Erro ao criar usuário:", error.message);
    return null;
  }

  return data[0];
}

export async function updateMessageCount(chat_id, count) {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ mensagens: count })
    .eq('chat_id', chat_id);

  if (error) {
    console.error("Erro ao atualizar mensagens:", error.message);
    return null;
  }

  return data;
}
