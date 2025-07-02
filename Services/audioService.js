import fs from 'fs';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import { openai } from './openaiService.js';
import { obterUsuario } from './userService.js';

export async function converterAudioParaTexto(caminho, userId) {
  const usuario = obterUsuario(userId);

  if (!usuario?.acessoLiberado) {
    return {
      erro: true,
      mensagem: '🔒 Para transcrever áudios, você precisa assinar um plano.'
    };
  }

  const caminhoConvertido = caminho.replace('.oga', '.mp3');

  return new Promise((resolve, reject) => {
    ffmpeg(caminho)
      .toFormat('mp3')
      .save(caminhoConvertido)
      .on('end', async () => {
        try {
          const audio = fs.createReadStream(caminhoConvertido);
          const resposta = await openai.audio.transcriptions.create({
            file: audio,
            model: 'whisper-1'
          });

          resolve({
            erro: false,
            texto: resposta.text,
            mensagem: `📝 Transcrição do áudio: ${resposta.text}`
          });
        } catch (erro) {
          console.error("Erro ao transcrever áudio:", erro);
          reject({
            erro: true,
            mensagem: "❌ Erro ao transcrever o áudio. Tente novamente."
          });
        }
      })
      .on('error', (erro) => {
        console.error("Erro ao converter áudio:", erro);
        reject({
          erro: true,
          mensagem: "❌ Erro ao converter o áudio. Verifique o formato."
        });
      });
  });
}
