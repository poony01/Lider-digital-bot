export async function configurarComandos(bot, donoId) {
  const comandos = [
    { command: "convidar", description: "📨 Seu link de convite" },
    { command: "saldo", description: "💰 Ver meu saldo e convidados" },
    { command: "saque", description: "📤 Solicitar saque via Pix" },
    { command: "pixminhachave", description: "🔑 Atualizar minha chave Pix" }
  ];

  const comandosAdmin = [
    { command: "assinantes", description: "📊 Ver total de assinantes" },
    { command: "indicacoes", description: "🧾 Ver indicações e convites" },
    { command: "pagamentos", description: "📥 Saques pendentes" },
    { command: "usuarios", description: "👥 Ver todos os usuários" }
  ];

  try {
    await bot.setMyCommands(comandos);
    await bot.setMyCommands([...comandos, ...comandosAdmin], {
      scope: { type: "chat", chat_id: Number(donoId) },
    });

    console.log("✅ Comandos do menu configurados.");
  } catch (error) {
    console.error("❌ Erro ao configurar comandos:", error.message);
  }
}
