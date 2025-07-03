import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bot Líder Digital (Telegram + IA + Pix) está rodando!');
});

// Não define rota /webhook aqui, pois na Vercel esse endpoint é separado (webhook.js)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
