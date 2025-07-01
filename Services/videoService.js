import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

export async function gerarVideo(prompt) {
  try {
    const response = await openai.createVideo({
      prompt,
      model: "video-creation-001",
      response_format: "url"
    });

    return response.data?.data[0]?.url || null;
  } catch (error) {
    console.error('Erro ao gerar vídeo:', error.message);
    return null;
  }
}
