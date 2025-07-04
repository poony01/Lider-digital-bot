// services/iaService.js
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Ajuda para caminho de arquivos locais (caso use no futuro)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IA de texto (responde perguntas)
export async function responderIA(pergunta, modelo = "gpt-3.5-turbo") {
  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelo,
        messages: [{ role: "user", content: pergunta }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const dados = await resposta.json();
    return dados.choices?.[0]?.message?.content?.trim() || "❌ Não consegui entender sua pergunta.";
  } catch (erro) {
    console.error("Erro ao acessar IA:", erro);
    return "❌ Erro ao tentar responder com IA.";
  }
}

// IA com visão (interpreta imagens + texto opcional)
export async function analisarImagemComIA(imagemUrl, perguntaOpcional = "") {
  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imagemUrl },
              },
              ...(perguntaOpcional
                ? [{ type: "text", text: perguntaOpcional }]
                : []),
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const dados = await resposta.json();
    return dados.choices?.[0]?.message?.content?.trim() || "❌ Não consegui interpretar a imagem.";
  } catch (erro) {
    console.error("Erro ao analisar imagem:", erro);
    return "❌ Ocorreu um erro ao tentar analisar a imagem.";
  }
}
