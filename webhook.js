export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const msg = req.body.message;
      console.log("📩 Mensagem recebida:", JSON.stringify(msg, null, 2)); // TESTE

      if (msg && msg.text) {
        const texto = msg.text.trim();
        
        if (texto.startsWith("/")) {
          console.log("📌 Comando recebido:", texto); // TESTE
          await handleCommand(bot, msg);
        } else {
          console.log("🤖 Mensagem comum recebida"); // TESTE
          await handleMessage(bot, msg);
        }
      }

      res.status(200).send("OK");
    } else {
      res.status(405).send("Method Not Allowed");
    }
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    res.status(500).send("Erro interno no servidor.");
  }
}
