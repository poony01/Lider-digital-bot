import { openai } from './openaiService.js';
import { obterUsuario } from './userService.js';

export async function gerarImagem(prompt, userId) {
  const usuario = obterUsuario(userId);

  if (!usuario?.acessoLiberado) {
    return {
      erro: true,
      mensagem: '❌ Você precisa assinar um plano para gerar imagens.'
    };
  }

  try {
    const resposta = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024"
    });

    const urlImagem = resposta.data[0].url;

    return {
      erro: false,
      url: urlImagem,
      mensagem: `🖼️ Imagem gerada com base no prompt: *${prompt}*`
    };
  } catch (erro) {
    console.error("Erro ao gerar imagem:", erro.message);
    return {
      erro: true,
      mensagem: "❌ Ocorreu um erro ao tentar gerar a imagem. Tente novamente."
    };
  }
}
