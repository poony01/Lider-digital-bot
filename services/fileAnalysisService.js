// services/fileAnalysisService.js
import fetch from "node-fetch";

export async function analisarArquivo(mediaUrl, tipo = "imagem") {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", content: `Analise este ${tipo} e descreva o que vê com detalhes.` },
              {
                type: "image_url",
                image_url: {
                  url: mediaUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "❌ Não consegui analisar o conteúdo.";
  } catch (erro) {
    console.error("Erro ao analisar arquivo:", erro);
    return "❌ Ocorreu um erro ao analisar a imagem ou arquivo.";
  }
}
