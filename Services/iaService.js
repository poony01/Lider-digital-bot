import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

export async function gerarResposta(mensagem) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: mensagem }],
      temperature: 0.7
    });
    return completion.data.choices[0].message.content.trim();
  } catch (erro) {
    console.error('Erro ao gerar resposta da IA:', erro.message);
    return '❌ Ocorreu um erro ao gerar a resposta.';
  }
}
