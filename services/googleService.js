import fetch from "node-fetch";

const SERP_API_KEY = process.env.SERP_API_KEY;

export async function pesquisarNoGoogle(pergunta) {
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(pergunta)}&hl=pt-br&gl=br&api_key=${SERP_API_KEY}`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!dados.organic_results || dados.organic_results.length === 0) {
      return "❌ Não encontrei resultados relevantes no Google.";
    }

    const resultados = dados.organic_results.slice(0, 3).map((r, i) => {
      return `🔹 *${r.title}*\n${r.snippet}\n🌐 ${r.link}`;
    });

    return `🔎 Encontrei algumas informações no Google:\n\n${resultados.join("\n\n")}`;
  } catch (erro) {
    console.error("Erro ao pesquisar no Google:", erro);
    return "❌ Ocorreu um erro ao tentar pesquisar no Google.";
  }
}
