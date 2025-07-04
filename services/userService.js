// services/userService.js
import { createClient } from '@supabase/supabase-js';

// ⚠️ Lê os dados diretamente das variáveis da Vercel (.env configurado no painel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// 🔍 Buscar usuário por chat_id
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

// ➕ Criar novo usuário
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

// 🔄 Atualizar número de mensagens
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
