import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

export async function gerarImagem(descricao) {
  try {
    const response = await openai.createImage({
      prompt: descricao,
      n: 1,
      size: '1024x1024'
    });
    return response.data.data[0].url;
  } catch (error) {
    console.error('Erro ao gerar imagem:', error.message);
    return null;
  }
}
