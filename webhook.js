import { handleMessage } from "./controllers/messages.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const mensagem = req.body.message;
    if (mensagem) {
      await handleMessage(mensagem);
    }
    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
