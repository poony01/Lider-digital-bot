// ✅ webhook.js
import express from "express";
import fetch from "node-fetch";
import { receberMensagem } from "./serviços/messageController.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/:token", async (req, res) => {
  const token = req.params.token;

  if (token !== process.env.BOT_TOKEN) {
    return res.status(403).send("Token inválido.");
  }

  const update = req.body;

  try {
    await receberMensagem(update);
    res.send("OK");
  } catch (erro) {
    console.error("Erro ao processar a mensagem:", erro);
    res.sendStatus(500);
  }
});

export { router };
