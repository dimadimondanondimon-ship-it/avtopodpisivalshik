const { Telegraf, Markup } = require('telegraf');

// 🔥 токен Render
const bot = new Telegraf(process.env.BOT_TOKEN);

// настройки (по умолчанию включены)
let enableDate = true;
let enableLink = true;

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

    return ${day}.${month};
}

// 📌 МЕНЮ /mod
bot.command('mod', async (ctx) => {
    await ctx.reply(
        '⚙️ Панель управления',
        Markup.inlineKeyboard([
            [Markup.button.callback(Дата: ${enableDate ? 'ВКЛ' : 'ВЫКЛ'}, 'toggle_date')],
            [Markup.button.callback(Ссылка: ${enableLink ? 'ВКЛ' : 'ВЫКЛ'}, 'toggle_link')]
        ])
    );
});

// 🔘 кнопки
bot.action('toggle_date', async (ctx) => {
    enableDate = !enableDate;
    await ctx.answerCbQuery(Дата: ${enableDate ? 'включена' : 'выключена'});
});

bot.action('toggle_link', async (ctx) => {
    enableLink = !enableLink;
    await ctx.answerCbQuery(Ссылка: ${enableLink ? 'включена' : 'выключена'});
});

// 📢 обработка постов
bot.on('channel_post', async (ctx) => {
    try {
        const post = ctx.channelPost;

        const link = <a href="${CHANNEL_LINK}">${LINK_TEXT}</a>;

        // caption для фото
        if (post.photo) {

            let newCaption = '';

            if (enableDate) {
                newCaption += ${getTomorrowDate()}\n\n;
            }

            if (enableLink) {
                newCaption += ${link};
            }

            await ctx.telegram.editMessageCaption(
                post.chat.id,
                post.message_id,
                undefined,
                newCaption,
                { parse_mode: 'HTML' }
            );
        }

        // текстовые посты
        else if (post.text) {

            let newText = '';

            if (enableDate) {
                newText += ${getTomorrowDate()}\n\n;
            }

            newText += ${post.text}\n\n;

            if (enableLink) {
                newText += ${link};
            }

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

// запуск
bot.launch();
