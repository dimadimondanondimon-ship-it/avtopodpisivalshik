const { Telegraf } = require('telegraf');

// 🔥 ВСТАВЬ СЮДА ТОКЕН
const bot = new Telegraf(process.env.BOT_TOKEN);

// Ссылка
const CHANNEL_LINK = 'https://t.me/skkdirjdjdk';

// Текст ссылки
const LINK_TEXT = '7 школа - подписаться';

// Формат даты +1 день
function getTomorrowDate() {
    const date = new Date();

    date.setDate(date.getDate() + 1);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${day}.${month}`;
}

// Отслеживаем посты в канале
bot.on('channel_post', async (ctx) => {
    try {
        const post = ctx.channelPost;

        const link = `<a href="${CHANNEL_LINK}">${LINK_TEXT}</a>`;

        if (post.photo) {

            const newCaption =
`${getTomorrowDate()}

${link}`;

            await ctx.telegram.editMessageCaption(
                post.chat.id,
                post.message_id,
                undefined,
                newCaption,
                { parse_mode: 'HTML' }
            );
        }

        else if (post.text) {

            const newText =
`${post.text}

${link}`;

            await ctx.telegram.editMessageText(
                post.chat.id,
                post.message_id,
                undefined,
                newText,
                { parse_mode: 'HTML' }
            );
        }

    } catch (error) {
        console.log(error);
    }
});

bot.launch();