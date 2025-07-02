// Função auxiliar para gerar prompts inteligentes para IA, criação de imagens, vídeos, etc.

export default function gerarPrompt(tipo, contexto) {
  // tipo: 'texto', 'imagem', 'video', etc.
  // contexto: objeto com dados relevantes
  switch (tipo) {
    case "imagem":
      return `Crie uma imagem com o seguinte tema: ${contexto.tema || "desconhecido"}.`;
    case "video":
      return `Gere um vídeo sobre: ${contexto.tema || "desconhecido"}.`;
    case "voz":
      return `Converta a seguinte mensagem em áudio: ${contexto.texto || ""}.`;
    default:
      return `Responda: ${contexto.pergunta || ""}`;
  }
}
