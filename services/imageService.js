import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateImage(prompt) {
  const url = "https://api.openai.com/v1/images/generations";
  try {
    const response = await axios.post(
      url,
      {
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024"
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.data[0].url;
  } catch (err) {
    return null;
  }
}
