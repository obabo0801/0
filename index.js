// =====================
// ENV
// =====================
import { config } from 'dotenv';
config({quiet: true});

// =====================
// Discord
// =====================
import {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    MessageFlags,
    ContainerBuilder,
    UserSelectMenuBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ButtonBuilder
} from 'discord.js';

// =====================
// External
// =====================

// =====================
// Internal
// =====================
import {
    request, 
    create, 
    isReady, 
    find
} from '#db';

import {
    startBot
} from '#commands';

import {
    slashLog,
    cmdLog,
    chatLog,
    infoLog,
    errorLog
} from '#logger';

// =====================
// Constants
// =====================
export const MSG = {
    ENV_SUCCESS: '📄 .env 로드 성공',
    ENV_FAIL: '.env 로드 실패',
    ENV_INVALID: '.env 파일을 찾을 수 없습니다',

    COMMAND_SUCCESS: '🌍 Global Commands 등록',
    COMMAND_FAIL: 'Global Commands 실패',

    GCOMMAND_SUCCESS: '🏠 Guild Commands 등록',
    GCOMMAND_FAIL: 'Guild Commands 실패',
    
    LOGIN_SUCCESS: '🟢 Discord 연결 완료',
    LOGIN_FAIL: '🔴 Discord 연결 실패',
    TOKEN_INVALID: '유효하지 않은 토큰입니다',
    DISALLOWED_INTENTS: '권한이 없습니다 ',

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

// =====================
// URL
// =====================
function sheetUrl(id) {
    return `https://docs.google.com/spreadsheets/d/${id}/edit`
}

// =====================
// Client
// =====================
const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

// =====================
// Initialize
// =====================
export function initialize() {
    console.log('────────────────────')
    console.log('　　Jjing Bot 🐕　　');
    console.log('────────────────────')
    initCommands();
}

// =====================
// Method
// =====================
async function findUser(name) {
    request(process.env.FUND_ID);
    await isReady();
    return await find('04!B12:AN', 0, name);
}

// =====================
// Commands
// =====================
export let commands = [];
export let gcommands = [];

export function initCommands() {
    gcommands = [
        new SlashCommandBuilder()
        .setName('jjing')
        .setDescription('jjing')
        .addStringOption(o =>
            o.setName('add')
            .setDescription('add')
        )
        .toJSON()
    ];
}

// =====================
// Execute
// =====================
async function commandExecute(i) {

}

// =====================
// Slash
// =====================
async function commandSlash(i) {
    slashLog(i);
    if (i.commandName === 'jjing') {
        await i.deferReply({ flags: MessageFlags.Ephemeral });

        const s = i.options.getString(`add`);

        if (!s) {
            return i.editReply({
                content: `s`, 
                flags: MessageFlags.Ephemeral
            });
        }

        slashLog(i, 'jjing');
        
        return i.editReply({
            content: 'jjing', 
            flags: MessageFlags.Ephemeral
        });
    }
}

// =====================
// Chatting
// =====================
async function commandChatting(m) {
    chatLog(m);
    if (m.content === '!0') {
        m.channel.sendTyping();
        chatLog(m);
        if ((await isReady()).ok)
        {
            m.reply('0');
        }
    }
}

// =====================
// Ready
// =====================
client.once('clientReady', async () => {
    client.user.setPresence({
        status: 'invisible'
    });

    if (client.isReady())
    {
        infoLog(MSG.LOGIN_SUCCESS);
        infoLog('👤', client.user.tag);
        request(process.env.MAIN_ID);
        await create();
    } else {
        errorLog(MSG.LOGIN_FAIL);
    }
});

// =====================
// Interaction
// =====================
client.on('interactionCreate', async (i) => {
    try {
        if (i.isChatInputCommand())
        {
            await commandSlash(i);
        } else {
            await commandExecute(i);
        }
    } catch (e) {
        errorLog('I', e);
    }
});

// =====================
// Message
// =====================
client.on('messageCreate', async (m) => {
    try {
        if (!m.author.bot)
        {
            await commandChatting(m);
        }
    } catch (e) {
        errorLog('M', e);
    }
});

// =====================
// BOT START
// =====================
startBot(client);