import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function transcreverAudio(caminho) {
  try {
    const response = await openai.createTranscription(
      fs.createReadStream(caminho),
      "whisper-1"
    );
    return response.data.text;
  } catch (error) {
    console.error("Erro ao transcrever áudio:", error.message);
    return null;
  }
}

export async function gerarRespostaVoz(texto) {
  try {
    const response = await openai.createSpeech({
      model: "tts-1",
      input: texto,
      voice: "nova",
      response_format: "mp3"
    });

    const caminho = path.resolve(`audios/voz_${Date.now()}.mp3`);
    fs.writeFileSync(caminho, Buffer.from(response.data));
    return caminho;
  } catch (error) {
    console.error("Erro ao gerar áudio de voz:", error.message);
    return null;
  }
}
