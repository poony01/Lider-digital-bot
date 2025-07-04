import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctxcotzwnpxkpulaxoaq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // ✔️ Use variável segura na Vercel
const supabase = createClient(supabaseUrl, supabaseKey);

// Buscar usuário
export async function getUser(chat_id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('chat_id', chat_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('❌ Erro ao buscar usuário:', error.message);
    return null;
  }

  return data;
}

// Criar novo usuário
export async function createUser(userData) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([userData]);

  if (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    return null;
  }

  return data[0];
}

// Atualizar contagem de mensagens
export async function updateMessageCount(chat_id, count) {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ mensagens: count })
    .eq('chat_id', chat_id);

  if (error) {
    console.error('❌ Erro ao atualizar mensagens:', error.message);
    return null;
  }

  return data;
}
