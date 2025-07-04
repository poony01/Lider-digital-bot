// services/userService.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctxcotzwnpxkpulaxoaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eGNvdHp3bnB4a3B1bGF4b2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjMxMzgsImV4cCI6MjA2NzIzOTEzOH0.fJGn5vKR7exfcgkyCON3cyKjY_b6pNdsA47BRadc1yI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para buscar usuário pelo chat_id
export async function getUser(chat_id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('chat_id', chat_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar usuário:', error.message);
    return null;
  }

  return data;
}

// Função para criar novo usuário
export async function createUser(userData) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([userData]);

  if (error) {
    console.error('Erro ao criar usuário:', error.message);
    return null;
  }

  return data[0];
}

// Função para atualizar o número de mensagens
export async function updateMessageCount(chat_id, count) {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ mensagens: count })
    .eq('chat_id', chat_id);

  if (error) {
    console.error('Erro ao atualizar mensagens:', error.message);
    return null;
  }

  return data;
}
