// =====================
// Index
// =====================

import { config } from 'dotenv';
config({quiet: true});

import { Client, GatewayIntentBits, 
    ContainerBuilder, UserSelectMenuBuilder, ButtonStyle, MessageFlags } from 'discord.js';

import { request, initialize, isReady, find } from '#db';
import { startBot } from '#commands';
import { cmdLog, chatLog, infoLog, errorLog } from '#logger';

// =====================
// Client
// =====================
const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

// =====================
// Messages
// =====================
export const MSG = {
    ENV_SUCCESS: '🟢 .env 로드 성공',
    ENV_FAIL: '.env 로드 실패',
    ENV_INVALID: '.env 파일을 찾을 수 없습니다',

    COMMAND_SUCCESS: '🟢 Commands 등록',
    COMMAND_FAIL: 'Commands 실패',
    
    LOGIN_SUCCESS: '🟢 Discord 연결 완료',
    LOGIN_FAIL: 'Discord 연결 실패',
    TOKEN_INVALID: '유효하지 않은 토큰입니다',

    AUTH_SUCCESS: '🔐 Google 인증 성공',
    AUTH_FAIL: 'Google 인증 실패',
    AUTH_INVALID: '인증 정보를 불러올 수 없습니다',

    SHEET_SUCCESS: '📊 Sheets 연결 완료',
    SHEET_FAIL: 'Sheets 연결 실패',

    ERROR400: '잘못된 요청 (400)',
    ERROR401: '인증 실패 (401)',
    ERROR403: '접근 권한 없음 (403)',

    QUIT: '프로그램을 종료합니다',
};

function url(id) {
    return `https://docs.google.com/spreadsheets/d/${id}/edit`
}

async function user1(name) {
    request(process.env.FUND_ID);
    await isReady();
    return await find('04!B12:AN', 0, name);
}

// =====================
// Ready
// =====================
client.once('clientReady', async () => {
    if (client.isReady())
    {
        infoLog(MSG.LOGIN_SUCCESS);
        infoLog('👤', client.user.tag);
        request(process.env.MAIN_ID);
        await initialize();
    } else {
        errorLog(MSG.LOGIN_FAIL);
    }
    
    // online idle dnd invisible
    client.user.setPresence({
        status: 'invisible'
    });
});

// =====================
// Interaction
// =====================
client.on('interactionCreate', async (i) => {
    if (!i.isChatInputCommand()) return;

    if (i.commandName === '멤버') {
        i.deferReply({ flags: MessageFlags.Ephemeral });

        const member = i.options.getMember(`대상`);

        if (!member) {
            return i.editReply({
                content: `멤버를 입력해주세요`, 
                flags: MessageFlags.Ephemeral
            });
        }

        const name = member.nickname ?? 
            member.user.globalName ?? 
            member.user.username;

        cmdLog(i, name);
        
        const result = await user1(name);
        if (!result) {
            return i.editReply({
                content: `${name}님은 존재하지 않습니다`, 
                flags: MessageFlags.Ephemeral
            });
        }
        return i.editReply({
            content: result.join(' '), 
            flags: MessageFlags.Ephemeral
        });
    }
});

// =====================
// Message
// =====================
client.on('messageCreate', async (m) => {
    if (m.author.bot) return;

    if (m.content === '!0') {
        m.channel.sendTyping();

        chatLog(m);

        if ((await isReady()).ok)
        {
            m.reply('0');
        }
    }
});

// =====================
// BOT START
// =====================
startBot(client);