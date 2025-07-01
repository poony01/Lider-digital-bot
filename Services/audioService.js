import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

export async function transcreverAudio(caminhoAudio) {
  const caminhoConvertido = caminhoAudio.replace('.ogg', '.mp3');

  return new Promise((resolve, reject) => {
    ffmpeg(caminhoAudio)
      .toFormat('mp3')
      .on('error', (err) => {
        console.error('Erro na conversão:', err.message);
        reject(null);
      })
      .on('end', async () => {
        try {
          const resposta = await openai.createTranscription(
            fs.createReadStream(caminhoConvertido),
            'whisper-1'
          );
          resolve(resposta.data.text);
        } catch (err) {
          console.error('Erro na transcrição:', err.message);
          resolve(null);
        }
      })
      .save(caminhoConvertido);
  });
}
