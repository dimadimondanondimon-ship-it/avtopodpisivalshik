const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// настройки
let enableDate = true;
let enableLink = true;

// кеш для альбомов
const albums = new Map();

// Ссылка
const CHANNEL_LINK = 'https://t.me/skkdirjdjdk';
const LINK_TEXT = '7 школа - подписаться';

// дата +1 день
function getTomorrowDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${day}.${month}`;
}

// меню
bot.command('mod', async (ctx) => {
    await ctx.reply(
        '⚙️ Панель управления',
        Markup.inlineKeyboard([
            [Markup.button.callback(`Дата: ${enableDate ? 'ВКЛ' : 'ВЫКЛ'}`, 'toggle_date')],
            [Markup.button.callback(`Ссылка: ${enableLink ? 'ВКЛ' : 'ВЫКЛ'}`, 'toggle_link')]
        ])
    );
});

// кнопки
bot.action('toggle_date', async (ctx) => {
    enableDate = !enableDate;
    await ctx.answerCbQuery(`Дата: ${enableDate ? 'включена' : 'выключена'}`);
});

bot.action('toggle_link', async (ctx) => {
    enableLink = !enableLink;
    await ctx.answerCbQuery(`Ссылка: ${enableLink ? 'включена' : 'выключена'}`);
});

// обработка канал постов
bot.on('channel_post', async (ctx) => {
    try {
        const post = ctx.channelPost;
        const link = `<a href="${CHANNEL_LINK}">${LINK_TEXT}</a>`;

        // 📸 АЛЬБОМ (2+ фото)
        if (post.media_group_id) {

            if (!albums.has(post.media_group_id)) {
                albums.set(post.media_group_id, []);
            }

            albums.get(post.media_group_id).push(post
