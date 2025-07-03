export async function processarPergunta(pergunta) {
  // Checa se a chave OPENAI_API_KEY está definida (no ambiente Vercel)
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return "Erro: OPENAI_API_KEY não está configurada no ambiente.";
  }

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: pergunta }
        ]
      })
    });

    if (!resposta.ok) {
      return "Erro ao acessar a OpenAI. Verifique sua chave e limite de uso.";
    }

    const data = await resposta.json();
    return data.choices?.[0]?.message?.content?.trim() || "Não foi possível gerar uma resposta no momento.";
  } catch (e) {
    return "Erro interno ao consultar a IA.";
  }
}
