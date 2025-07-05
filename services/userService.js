import fetch from "node-fetch";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const headers = {
  "apikey": supabaseKey,
  "Authorization": `Bearer ${supabaseKey}`,
  "Content-Type": "application/json"
};

export async function getUser(chat_id) {
  const res = await fetch(`${supabaseUrl}/rest/v1/usuarios?chat_id=eq.${chat_id}`, { headers });
  const data = await res.json();
  return data[0];
}

export async function createUser(user) {
  const res = await fetch(`${supabaseUrl}/rest/v1/usuarios`, {
    method: "POST",
    headers,
    body: JSON.stringify(user)
  });
  const data = await res.json();
  return data[0];
}

export async function updateMessageCount(chat_id, mensagens) {
  await fetch(`${supabaseUrl}/rest/v1/usuarios?chat_id=eq.${chat_id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ mensagens })
  });
}
