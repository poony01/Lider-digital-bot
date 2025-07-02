import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { obterAssinante } from './userService.js';
import { DONO_ID } from '../config.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function criarVideo(texto, userId) {
  const usuario = await obterAssinante(userId);
  const acessoLiberado = userId.toString() === DONO_ID || (usuario && usuario.pagamentoConfirmado);

  if (!acessoLiberado) {
    return { erro: 'Você precisa assinar um plano para gerar vídeos.' };
  }

  try {
    const resposta = await openai.video.generations.create({
      model: "video-beta-001",
      prompt: texto,
    });

    const urlVideo = resposta.data[0]?.video_url;
    if (!urlVideo) return { erro: 'Não foi possível gerar o vídeo. Tente novamente.' };

    const respostaArquivo = await fetch(urlVideo);
    const buffer = Buffer.from(await respostaArquivo.arrayBuffer());

    const nomeArquivo = `video_${Date.now()}.mp4`;
    const caminho = path.resolve('videos', nomeArquivo);
    fs.writeFileSync(caminho, buffer);

    return { caminho };
  } catch (erro) {
    console.error('Erro ao gerar vídeo:', erro);
    return { erro: 'Erro ao gerar vídeo.' };
  }
}
