import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import https from 'https';

// 🔐 Variáveis de ambiente
const BOT_TOKEN = process.env.BOT_TOKEN;
const DONO_ID = process.env.DONO_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CLIENT_ID = process.env.EFI_CLIENT_ID;
const CLIENT_SECRET = process.env.EFI_CLIENT_SECRET;
const PIX_NOME = process.env.EFI_PIX_NOME;
const PIX_CHAVE = process.env.EFI_PIX_CHAVE;
const CERT_PASSWORD = process.env.EFI_CERT_PASSWORD;
const CERT_BASE64 = process.env.EFI_CERT_BASE64;

const MAX_FREE_MESSAGES = 5;
const users = new Map(); // Simples memória em tempo real

const certBuffer = Buffer.from(CERT_BASE64, 'base64');

const agent = new https.Agent({
  pfx: certBuffer,
  passphrase: CERT_PASSWORD,
  rejectUnauthorized: false
});

const bot = new TelegramBot(BOT_TOKEN);

// ✅ Rota Webhook para Vercel
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const update = req.body;

    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallback(update.callback_query);
    }

    res.status(200).send('OK');
  } else {
    res.status(200).send('Bot online na Vercel 🚀');
  }
}

// 🧠 IA com OpenAI
async function responderIA(pergunta, modelo = 'gpt-3.5-turbo') {
  const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelo,
      messages: [{ role: 'user', content: pergunta }],
      temperature: 0.7
    })
  });

  const data = await resposta.json();
  return data.choices?.[0]?.message?.content || '❌ Erro ao responder';
}

// 🎨 Gerar imagem com DALL·E 3
async function gerarImagem(prompt) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024'
    })
  });

  const data = await response.json();
  return data?.data?.[0]?.url || null;
}

// 💳 Gerar cobrança Pix
async function gerarCobrancaPix(valor, descricao) {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const tokenRes = await fetch('https://api.efi.com.br/v1/authorize', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    agent
  });

  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  const body = {
    calendario: { expiracao: 3600 },
    devedor: { nome: PIX_NOME },
    valor: { original: valor.toFixed(2) },
    chave: PIX_CHAVE,
    infoAdicionais: [{ nome: 'Assinatura', valor: descricao }]
  };

  const response = await fetch('https://api.efi.com.br/v2/cob', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    agent
  });

  const data = await response.json();

  if (!data?.loc?.id) return null;

  const qrRes = await fetch(`https://api.efi.com.br/v2/loc/${data.loc.id}/qrcode`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    agent
  });

  const qrData = await qrRes.json();
  return {
    qrCodeUrl: qrData.imagemQrcode,
    copiaCola: qrData.qrcode
  };
}

// 📩 Mensagens
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || 'Usuário';
  const texto = msg.text;

  if (!texto) return;

  // Comando inicial
  if (texto === '/start') {
    await bot.sendMessage(chatId, `👋 Olá, ${nome}!\n\n✅ Seja bem-vindo(a) ao *Líder Digital Bot*, sua assistente com inteligência artificial.\n\n🎁 Plano gratuito com 5 mensagens:\n\n🧠 IA que responde perguntas\n🖼️ Geração de imagens com IA\n🎙️ Transcrição de áudios\n\n💳 Após isso, escolha um plano abaixo:`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔓 Assinar Plano Básico - R$14,90', callback_data: 'assinar_basico' }],
          [{ text: '✨ Assinar Plano Premium - R$22,90', callback_data: 'assinar_premium' }]
        ]
      }
    });
    return;
  }

  // Geração de imagem
  if (texto.toLowerCase().startsWith('img ')) {
    const prompt = texto.replace('img ', '').trim();
    const url = await gerarImagem(prompt);
    if (url) {
      await bot.sendPhoto(chatId, url, { caption: '🖼️ Imagem gerada com IA (DALL·E 3)' });
    } else {
      await bot.sendMessage(chatId, '❌ Erro ao gerar imagem. Tente outro prompt.');
    }
    return;
  }

  // Registra e atualiza usuário
  if (!users.has(chatId)) {
    users.set(chatId, { plano: 'gratis', mensagens: 1 });
  } else {
    const dados = users.get(chatId);
    if (dados.plano === 'gratis' && dados.mensagens >= MAX_FREE_MESSAGES) {
      await bot.sendMessage(chatId, `⚠️ Você atingiu o limite de ${MAX_FREE_MESSAGES} mensagens gratuitas.`);
      return;
    }
    dados.mensagens += 1;
    users.set(chatId, dados);
  }

  const plano = users.get(chatId).plano;
  const modelo = plano === 'premium' ? 'gpt-4-turbo' : 'gpt-3.5-turbo';
  const resposta = await responderIA(texto, modelo);
  await bot.sendMessage(chatId, resposta);
}

// 📦 Botão de planos
async function handleCallback(query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  let plano, valor;
  if (data === 'assinar_basico') {
    plano = 'Plano Básico - R$14,90/mês';
    valor = 14.9;
  } else if (data === 'assinar_premium') {
    plano = 'Plano Premium - R$22,90/mês';
    valor = 22.9;
  } else {
    return bot.answerCallbackQuery(query.id, { text: '❌ Opção inválida.' });
  }

  await bot.answerCallbackQuery(query.id);
  const cobranca = await gerarCobrancaPix(valor, plano);

  if (!cobranca) {
    return bot.sendMessage(chatId, '❌ Erro ao gerar o Pix. Tente novamente.');
  }

  await bot.sendPhoto(chatId, cobranca.qrCodeUrl, {
    caption: `✅ *${plano}*\n\n💳 Escaneie o QR Code ou use o código abaixo:\n\n\`\`\`${cobranca.copiaCola}\`\`\`\n\n⏱️ Expira em 1 hora.`,
    parse_mode: 'Markdown'
  });
}
