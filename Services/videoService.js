// serviços/videoService.js

import { createReadStream } from 'fs';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function gerarVideo(prompt) {
  try {
    // Simulação de geração de vídeo (em produção use outra ferramenta)
    const fakeVideoPath = path.resolve("audios", "exemplo.mp4");
    return createReadStream(fakeVideoPath);
  } catch (erro) {
    console.error("Erro ao gerar vídeo:", erro);
    return null;
  }
}
