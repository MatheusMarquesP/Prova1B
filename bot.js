const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');

const token = '6993533055:AAHVYHcU2NNhv_vVU8zDaYfP1kh5pMfJ_DM'; 

const prisma = new PrismaClient();

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 9 && currentHour < 18) {
        bot.sendMessage(chatId, 'Informações em: https://uvv.br');
    } else {
        bot.sendMessage(chatId, 'Olá! Estamos fora do horário comercial. Por favor, informe seu e-mail para contato:');
        bot.once('message', async (msg) => {
            const userEmail = msg.text;

            try {
                await prisma.email.create({
                    data: {
                        email: userEmail,
                    },
                });
                bot.sendMessage(chatId, 'Obrigado! Seu e-mail foi armazenado com sucesso. Entraremos em contato em breve.');
            } catch (error) {
                bot.sendMessage(chatId, 'Ocorreu um erro ao armazenar seu e-mail. Por favor, tente novamente mais tarde.');
            }
        });
    }
});

bot.on('polling_error', (error) => {
    console.error('Erro no polling:', error);
});
