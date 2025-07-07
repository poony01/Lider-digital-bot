import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askGPT(messages, model = "gpt-3.5-turbo") {
  const url = "https://api.openai.com/v1/chat/completions";
  try {
    const response = await axios.post(
      url,
      {
        model,
        messages // [{role:"user",content:"..."}]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    return "Erro ao consultar a IA.";
  }
}
