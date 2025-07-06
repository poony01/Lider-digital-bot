import fetch from "node-fetch";

export async function responderIA(pergunta, modelo = "gpt-3.5-turbo") {
  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelo,
      messages: [{ role: "user", content: pergunta }]
    })
  });

  const json = await resposta.json();
  return json.choices?.[0]?.message?.content || "❌ Erro ao gerar resposta.";
}
