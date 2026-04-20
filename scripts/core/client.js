// =====================
// Client
// =====================

import {
    parse
} from 'dotenv';

import {
    Client,
    GatewayIntentBits,
} from 'discord.js';

import {
    MSG
} from '#index';

import {
    createGCommands,
    createCommands
} from '#loader';

import {
    handleInteraction,
    handleMessage
} from '#handler';

import {
    infoLog,
    errorLog
} from '#logger';

import {
    createSheets
} from '#sheets';

import {
    readFile
} from '#file';

import {
    decode
} from '#base64';

export function startBot() {
    console.log('────────────────────')
    console.log('　　Jjing Bot 🐕　　');
    console.log('────────────────────')
    parseEnv('./scripts/.env');

    const client = new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]});

    client.once('clientReady', async () => {
        client.user.setPresence({
            status: 'invisible'
        });

        if (client.isReady()) {
            infoLog(MSG.LOGIN_SUCCESS);
            infoLog('👤', client.user.tag);
            await createSheets();
            await createGCommands();
            await createCommands();
        }
    });

    client.on('interactionCreate', async (i) => {
        await handleInteraction(i);
    });

    client.on('messageCreate', async (m) => {
        if (!m.author.bot) {
            await handleMessage(m);
        }
    });

    client.login(process.env.TOKEN);
}

export function parseEnv(str) {
    try {
        const data = readFile(str);

        if (!data) {
            errorLog(MSG.ENV_INVALID);
            process.exit(1);
        }

        const parsed = 
        parse(decode(data));

        process.env = {
            ...process.env,
            ...parsed
        };

        for (const k in parsed) {
            if (process.env[k]) {
                process.env[k] = 
                decode(process.env[k]);
            }
        };

        ['CACHE'].forEach(k => {
            if (process.env[k]) {
                process.env[k] = 
                JSON.parse(process.env[k]);
            }
        });

        infoLog(MSG.ENV_SUCCESS);
    } catch (e) {
        infoLog(MSG.ENV_FAIL)
    }
}

process.on('SIGINT', () => {
    infoLog(MSG.QUIT);
    process.exit();
});

process.on('SIGTERM', () => {
    infoLog(MSG.QUIT);
    process.exit();
});

process.on('uncaughtException', (e) => {
    errorLog(e);
});

process.on('unhandledRejection', (e) => {
    errorLog(e);
});