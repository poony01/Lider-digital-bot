import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Gera uma imagem profissional com DALL-E 3, aceitando prompts curtos ou longos.
 * Sempre usa a melhor qualidade disponível (HD se suportado).
 * Retorna a URL da imagem gerada, ou null em caso de erro.
 */
export async function gerarImagem(prompt) {
  const url = "https://api.openai.com/v1/images/generations";
  try {
    const response = await axios.post(
      url,
      {
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd" // Solicita qualidade avançada/profissional se disponível na conta
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.data[0].url;
  } catch (err) {
    return null;
  }
}
