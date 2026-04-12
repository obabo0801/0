require('dotenv').config({
    quiet: true
});

const {
    Client, GatewayIntentBits
} = require('discord.js');

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

const fs = require('fs');
const path = require('path');
const pad = v => String(v)
.padStart(2, '0');

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

        if (!fs.existsSync(f))
        {
            return null;
        }

        return fs.readFileSync(f, 'utf-8');
    } catch (e) {
        console.error(e.message);
        return null;
    }
}

function writeLog(file, ...args) {
    try {
        const d = path.join(__dirname, 'logs');

        if (!fs.existsSync(d))
        {
            fs.mkdirSync(d);
        }

        const f = path.join(d, file);

        fs.appendFileSync(f, `${args.join(' ')}\n`);
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

startBot(process.env.TOKEN);