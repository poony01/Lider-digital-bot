import { createVideo } from "./openaiService.js";

export async function gerarVideo(prompt) {
  try {
    const videoUrl = await createVideo(prompt);
    return videoUrl;
  } catch (error) {
    console.error("Erro ao gerar vídeo:", error.message);
    return null;
  }
}
