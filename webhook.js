// webhook.js
import { bot } from './index.js';
import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method === 'POST') {
    const update = req.body;

    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const texto = update.message.text;

      if (texto === '/start') {
        await bot.sendMessage(chatId, `🤖 Olá! Sou o Líder Digital Bot com IA.\n\nDigite qualquer pergunta para começar!`);
        return res.status(200).send('Start OK');
      }

      try {
        const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: texto }]
          })
        });

        const data = await resposta.json();
        const respostaIA = data.choices?.[0]?.message?.content || "❌ Erro ao gerar resposta.";

        await bot.sendMessage(chatId, respostaIA);
      } catch (error) {
        console.error('Erro ao chamar OpenAI:', error);
        await bot.sendMessage(chatId, '❌ Erro ao responder. Tente novamente.');
      }
    }

    res.status(200).send('OK');
  } else {
    res.status(200).send('Bot está online ✅');
  }
};
