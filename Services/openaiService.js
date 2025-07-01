import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function responderIA(pergunta) {
  try {
    const resposta = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um assistente inteligente, objetivo e educado.' },
        { role: 'user', content: pergunta }
      ]
    });

    return resposta.choices[0].message.content.trim();
  } catch (err) {
    console.error('Erro ao responder IA:', err.message);
    return '❌ Erro ao gerar resposta. Tente novamente.';
  }
}
