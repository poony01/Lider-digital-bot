import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(message) {
  const url = 'https://api.openai.com/v1/chat/completions';
  try {
    const response = await axios.post(
      url,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (e) {
    return 'Erro ao consultar a IA.';
  }
}
