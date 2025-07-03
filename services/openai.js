// Serviço para integração com a API da OpenAI (GPT, DALL-E, etc.)
// Adapte para usar fetch ou axios conforme seu projeto for evoluindo

export async function processarPergunta(pergunta) {
  // Exemplo de integração simulada, troque pela chamada real à API da OpenAI
  // Veja documentação oficial para detalhes de autenticação e payload
  // https://platform.openai.com/docs/api-reference/chat/create
  //
  // Exemplo real (usando fetch):
  // const resposta = await fetch("https://api.openai.com/v1/chat/completions", { ... });
  // return resposta.choices[0].message.content;

  return `Resposta da IA para: ${pergunta}`;
}
