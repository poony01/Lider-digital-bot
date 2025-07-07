import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(prompt, model = "gpt-3.5-turbo") {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [
      { role: "system", content: "Você é um assistente útil do Telegram." },
      { role: "user", content: prompt }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error("Erro ao falar com a IA:", await response.text());
    return "Desculpe, houve um erro ao falar com a IA.";
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Sem resposta da IA.";
}
