import TelegramBot from 'node-telegram-bot-api';

console.log('Iniciando bot com token:', Boolean(process.env.BOT_TOKEN));
// NÃO imprima o token real em produção!

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
