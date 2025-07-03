export async function processarPergunta(pergunta) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "Erro: OPENAI_API_KEY não configurada.";
  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: pergunta },
        ],
      }),
    });
    if (!resposta.ok) return "Erro ao acessar a OpenAI.";
    const data = await resposta.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sem resposta da IA.";
  } catch {
    return "Erro interno ao consultar a IA.";
  }
}
