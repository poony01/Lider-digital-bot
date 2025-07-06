// services/userService.js
import fetch from "node-fetch";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
  "Content-Type": "application/json"
};

export async function getUser(chatId) {
  const res = await fetch(`${supabaseUrl}/rest/v1/usuarios?chat_id=eq.${chatId}&select=*`, { headers });
  const data = await res.json();
  return data?.[0] || null;
}

export async function createUser(usuario) {
  const res = await fetch(`${supabaseUrl}/rest/v1/usuarios`, {
    method: "POST",
    headers,
    body: JSON.stringify(usuario)
  });
  const data = await res.json();
  return data?.[0] || null;
}

export async function updateMessageCount(chatId, mensagens) {
  await fetch(`${supabaseUrl}/rest/v1/usuarios?chat_id=eq.${chatId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ mensagens })
  });
}
