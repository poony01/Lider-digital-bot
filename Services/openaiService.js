import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function responderPergunta(texto) {
  try {
    const resposta = await openai.chat.completions.create({
      messages: [{ role: 'user', content: texto }],
      model: 'gpt-4o',
    });

    return resposta.choices[0].message.content.trim();
  } catch (erro) {
    console.error('Erro ao responder com IA:', erro.message);
    return '❌ Ocorreu um erro ao tentar responder. Tente novamente mais tarde.';
  }
}
