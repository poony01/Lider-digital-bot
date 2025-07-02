import { openai } from './openaiService.js';
import { obterUsuario } from './userService.js';

export async function gerarVideo(prompt, userId) {
  const usuario = obterUsuario(userId);

  if (!usuario?.acessoLiberado) {
    return {
      erro: true,
      mensagem: '❌ Você precisa assinar um plano para gerar vídeos.'
    };
  }

  try {
    const resposta = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Gere uma miniatura para o vídeo com o tema: ${prompt}`,
      n: 1,
      size: "1024x1024"
    });

    const urlImagem = resposta.data[0].url;

    // Simula a geração de um vídeo com base no prompt
    return {
      erro: false,
      url: urlImagem, // Neste exemplo estamos simulando a geração com uma imagem representando um vídeo
      mensagem: `🎬 Vídeo gerado com base no tema: *${prompt}*`
    };
  } catch (erro) {
    console.error("Erro ao gerar vídeo:", erro.message);
    return {
      erro: true,
      mensagem: "❌ Ocorreu um erro ao tentar gerar o vídeo. Tente novamente."
    };
  }
}
