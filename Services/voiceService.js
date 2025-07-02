import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { OpenAI } from 'openai';
import { obterAssinante } from '../serviços/userService.js';
import { DONO_ID } from '../config.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcreverAudio(caminhoAudio) {
  const audio = fs.createReadStream(caminhoAudio);
  const resposta = await openai.audio.transcriptions.create({
    file: audio,
    model: 'whisper-1',
    language: 'pt',
  });
  return resposta.text;
}

export async function gerarRespostaEmAudio(texto, userId) {
  const usuario = await obterAssinante(userId);
  const acessoLiberado = userId.toString() === DONO_ID || (usuario && usuario.pagamentoConfirmado);

  if (!acessoLiberado) {
    return null;
  }

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: texto,
  });

  const nomeArquivo = `voz_${Date.now()}.mp3`;
  const caminho = path.resolve('audios', nomeArquivo);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(caminho, buffer);

  return caminho;
}
