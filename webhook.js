import { bot } from "./bot.js";
import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method === "POST") {
    const update = req.body;

    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const texto = update.message.text;

      if (texto === "/start") {
        await bot.sendMessage(chatId, `🤖 Olá! Eu sou seu bot com IA. Envie uma pergunta e responderei!`);
        return res.status(200).send("OK");
      }

      const resposta = await responderIA(texto);
      await bot.sendMessage(chatId, resposta);
    }

    res.status(200).send("OK");
  } else {
    res.status(200).send("Bot está online 🚀");
  }
};

// Função para consultar IA (ChatGPT)
async function responderIA(pergunta) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: pergunta }]
      })
    });

    const json = await response.json();
    return json.choices?.[0]?.message?.content || "❌ Erro ao gerar resposta.";
  } catch {
    return "❌ Erro ao conectar com a IA.";
  }
}
