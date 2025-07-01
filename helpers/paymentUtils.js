// helpers/paymentUtils.js

export function gerarCodigoPixCopiaCola(chave, nome, valor, descricao) {
  const payloadFormatIndicator = "000201";
  const merchantAccountInformation = `26${"0014"}br.gov.bcb.pix01${
    chave.length < 10 ? "0" + chave.length : chave.length
  }${chave}`;
  const merchantCategoryCode = "52040000";
  const transactionCurrency = "5303986";
  const transactionAmount = `54${valor.length < 10 ? "0" + valor.length : valor.length}${valor}`;
  const countryCode = "5802BR";
  const merchantName = `59${nome.length < 10 ? "0" + nome.length : nome.length}${nome}`;
  const merchantCity = "6009SaoPaulo";
  const additionalDataFieldTemplate = "62070503***";

  const payload =
    payloadFormatIndicator +
    merchantAccountInformation +
    merchantCategoryCode +
    transactionCurrency +
    transactionAmount +
    countryCode +
    merchantName +
    merchantCity +
    additionalDataFieldTemplate;

  return payload;
}
