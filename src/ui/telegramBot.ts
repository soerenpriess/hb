import TelegramBot from 'node-telegram-bot-api';

const token = '8109377544:AAFBr8kOqBDS_dgd95fc2s-So5EkYXzHhfs';
const bot = new TelegramBot(token, { polling: true });

export const sendTelegramMessage = (message: string) => {
    const chatId = '1741377810'; // Ersetzen Sie dies durch Ihre Chat-ID
    bot.sendMessage(chatId, message);
    console.log('Message sent');
};
