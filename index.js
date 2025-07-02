// ✅ index.js
import express from "express";
import { json } from "body-parser";
import { router as webhookRouter } from "./webhook.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use("/webhook", webhookRouter);

app.get("/", (req, res) => {
  res.send("Bot rodando com sucesso na Vercel!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
