const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// настройки
let enableDate = true;
let enableLink = true;

// кеш альбомов
const albums = new Map();
const albumTimers = new Map();

// ссылка
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

// сборка альбома
function processAlbum(groupId, ctx) {
    const group = albums.get(groupId);
    if (!group || group.length === 0) return;

    const first = group[0];

    const link = `<a href="${CHANNEL_LINK}">${LINK_TEXT}</a>`;

    let caption = '';

    if (enableDate) {
        caption += `${getTomorrowDate()}\n\n`;
    }

    if (enableLink) {
        caption += link;
    }

    ctx.telegram.editMessageCaption(
        first.chat.id,
        first.message_id,
        undefined,
        caption,
        { parse_mode: 'HTML' }
    ).catch(() => {});
}

// меню
bot.command('mod', async (ctx) => {
    await ctx.reply(
        '⚙️ Панель управления',
        Markup.inlineKeyboard([
            [Markup.button.callback`(Дата: ${enableDate ? 'ВКЛ' : 'ВЫКЛ'}`, 'toggle_date')],
            [Markup.button.callback`(Ссылка: ${enableLink ? 'ВКЛ' : 'ВЫКЛ'}`, 'toggle_link')]
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

// обработка постов
bot.on('channel_post', async (ctx) => {
    try {
        const post = ctx.channelPost;

        // 📸 АЛЬБОМ (2+ фото)
        if (post.media_group_id) {

            const groupId = post.media_group_id;

            if (!albums.has(groupId)) {
                albums.set(groupId, []);
            }

            albums.get(groupId).push(post);

            // сбрасываем старый таймер
            if (albumTimers.has(groupId)) {
                clearTimeout(albumTimers.get(groupId));
            }

            // ждём окончания альбома
            albumTimers.set(groupId, setTimeout(() => {
                processAlbum(groupId, ctx);

                albums.delete(groupId);
                albumTimers.delete(groupId);

            }, 1200));

            return;
        }

        const link = <a href="${CHANNEL_LINK}">${LINK_TEXT}</a>;

        // 📸 ОДНО ФОТО
        if (post.photo) {

            let caption = '';

            if (enableDate) {
                caption += ${getTomorrowDate()}\n\n;
            }

            if (enableLink) {
                caption += link;
            }

            await ctx.telegram.editMessageCaption(
                post.chat.id,
                post.message_id,
                undefined,
                caption,
                { parse_mode: 'HTML' }
            );
        }

        // 📝 ТЕКСТ
        else if (post.text) {

            let text = post.text + '\n\n';

            if (enableLink) {
                text += link;
            }

            await ctx.telegram.editMessageText(
                post.chat.id,
                post.message_id,
                undefined,
                text,
                { parse_mode: 'HTML' }
            );
        }

    } catch (err) {
        console.log(err);
    }
});

bot.launch();
