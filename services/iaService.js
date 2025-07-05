import fetch from "node-fetch";

export async function responderIA(pergunta, modelo = "gpt-3.5-turbo", chatId) {
  const mensagens = [{ role: "user", content: pergunta }];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelo,
      messages: mensagens,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Desculpe, não consegui responder.";
}
