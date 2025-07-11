// services/runwayService.js
import fetch from "node-fetch";

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;
const RUNWAY_MODEL_ID = "runwayml/gen-2"; // Modelo da Runway para vídeo

export async function criarVideoRunway({ prompt, imageUrl = null, duration = 10, audio = null }) {
  try {
    const input = {
      prompt,
      seed: Math.floor(Math.random() * 100000),
      duration,
      ...(imageUrl ? { image: imageUrl } : {}),
      ...(audio ? { audio } : {})
    };

    const response = await fetch(`https://api.runwayml.com/v1/models/${RUNWAY_MODEL_ID}/inference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const erro = await response.text();
      console.error("❌ Erro na resposta da Runway:", erro);
      return null;
    }

    const data = await response.json();

    if (data?.output?.video) {
      return data.output.video; // Retorna URL do vídeo gerado
    } else {
      console.error("⚠️ Resposta inesperada da Runway:", data);
      return null;
    }

  } catch (erro) {
    console.error("❌ Erro ao gerar vídeo na Runway:", erro.message);
    return null;
  }
}
