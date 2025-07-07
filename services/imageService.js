import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Gera uma imagem profissional e realista com DALL-E 3, aceitando prompts curtos ou longos.
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
        prompt: prompt,
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
    if (
      response.data &&
      Array.isArray(response.data.data) &&
      response.data.data[0] &&
      response.data.data[0].url
    ) {
      return response.data.data[0].url;
    }
    return null;
  } catch (err) {
    // Para facilitar o debug, logue o erro:
    console.error("Erro ao gerar imagem:", err.response?.data || err.message);
    return null;
  }
}

/**
 * Exemplo de função utilitária para gerar imagens profissionais e realistas a partir de qualquer prompt do cliente.
 * Esta função é opcional e pode ser chamada diretamente se desejar.
 */
export async function gerarImagemProfissional(prompt) {
  // Aqui você pode adicionar instruções extras para garantir realismo se desejar:
  const promptFinal = `${prompt}. Foto profissional, estilo realista, iluminação natural, detalhes nítidos, alta qualidade.`;
  return await gerarImagem(promptFinal);
}
