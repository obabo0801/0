import { config, parse } from 'dotenv';
config({quiet: true});

import { Client, 
    GatewayIntentBits } from 'discord.js';

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

import { existsSync, readFileSync, 
    mkdirSync, appendFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pad = v => String(v).padStart(2, '0');

const msg = {
    INFO_LOG: '정보',
    ERROR_LOG: '에러',
    WARN_LOG: '경고',

    LOGIN_SUCCESS: '로그인 성공',
    LOGIN_FAIL: '로그인 실패',

    TOKEN_INVALID: '토큰이 없거나 잘못되었습니다',

    BYE: '종료합니다'
};

client.once('clientReady', () => {
    if (client.isReady())
    {
        infoLog(client.user.tag);
        infoLog(msg.LOGIN_SUCCESS);
    } else {
        errorLog(msg.LOGIN_FAIL);
    }

    client.user.setPresence({
        status: 'invisible' // online idle dnd invisible
    });
});

client.on('messageCreate', (m) => {
    if (m.author.bot) return;

    if (m.content === '!0') {
        m.reply('0');
    }
});

function getDate() {
    const n = new Date();
    return (
        `${n.getFullYear()}-` +
        `${pad(n.getMonth() + 1)}-` +
        `${pad(n.getDate())}`
    );
}

function getTime() {
    const n = new Date();
    return (
        `${pad(n.getMonth() + 1)}/` +
        `${pad(n.getDate())} ` +
        `${pad(n.getHours())}:` +
        `${pad(n.getMinutes())}`
    );
}

function readLog(file) {
    try {
        const d = path.join(__dirname, 'logs');
        const f = path.join(d, file);

        if (!existsSync(f))
        {
            return null;
        }

        return readFileSync(f, 'utf-8');
    } catch (e) {
        console.error(e.message);
        return null;
    }
}

function writeLog(file, ...args) {
    try {
        const d = path.join(__dirname, 'logs');

        if (!existsSync(d))
        {
            mkdirSync(d);
        }

        const f = path.join(d, file);

        appendFileSync(f, `${args.join(' ')}\n`);
    } catch (e) {
        console.error(e.message);
    }
}

function infoLog(...args) {
    const t = `[${getTime()}] ` +
    `[${msg.INFO_LOG}] ${args.join(' ')}`
    console.info(t);
    writeLog(`${getDate()}.log`, t);
}

function errorLog(...args) {
    const t = `[${getTime()}] ` +
    `[${msg.ERROR_LOG}] ${args.join(' ')}`
    console.error(t);
    writeLog(`${getDate()}.log`, t);
}

function warnLog(...args) {
    const t = `[${getTime()}] ` +
    `[${msg.WARN_LOG}] ${args.join(' ')}`
    console.warn(t);
    writeLog(`${getDate()}.log`, t);
}

function encode(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}

function decode(str) {
    return Buffer.from(str, 'base64').toString('utf8');
}

async function startBot(token) {
    try {
        await client.login(token);
    } catch (e) {
        if (e.code === 'TokenInvalid') {
            errorLog(msg.TOKEN_INVALID);
        } else {
            errorLog(e.message);
        }
    }
}

process.env = {
    ...process.env, ...parse(
        decode(readLog('../.env'))
    )
}

startBot(process.env.TOKEN);