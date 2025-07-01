import fs from 'fs';
import axios from 'axios';
import { transcreverAudio } from './audioService.js';
import { responderIA } from './openaiService.js';

export async function processarAudioVoz(fileId, bot, chatId) {
  try {
    const link = await bot.telegram.getFileLink(fileId);
    const caminhoAudio = `audios/${fileId}.ogg`;

    const response = await axios.get(link.href, { responseType: 'stream' });
    const writer = fs.createWriteStream(caminhoAudio);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const texto = await transcreverAudio(caminhoAudio);
    if (!texto) {
      return await bot.telegram.sendMessage(chatId, '❌ Não consegui entender o áudio.');
    }

    await bot.telegram.sendMessage(chatId, `🗣️ Você disse: ${texto}`);

    const resposta = await responderIA(texto);
    await bot.telegram.sendMessage(chatId, `🤖 ${resposta}`);
  } catch (error) {
    console.error('Erro ao processar áudio de voz:', error.message);
    await bot.telegram.sendMessage(chatId, '❌ Erro ao processar o áudio.');
  }
}
