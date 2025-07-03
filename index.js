import express from 'express';
import webhook from './webhook.js';

const app = express();
app.use(express.json());

// Webhook endpoint
app.post('/webhook', webhook);

// Basic health check
app.get('/', (req, res) => {
  res.send('Bot Líder Digital (Telegram + IA + Pix) está rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
