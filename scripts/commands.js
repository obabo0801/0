// =====================
// Commands
// =====================

import { commands, gcommands } from '#index';
import { parse } from 'dotenv';
import { REST, Routes } from 'discord.js';
import { MSG } from '#index';
import { readFile, decode } from '#utils';
import { infoLog, errorLog } from '#logger';

export function parseEnv(str) {
    try {
        const data = readFile(str);
        if (!str || !data) {
            errorLog(MSG.ENV_INVALID);
            process.exit(1);
        }
        process.env = {...process.env, 
            ...parse(decode(data))
        };
        infoLog(MSG.ENV_SUCCESS);
    } catch (e) {
        infoLog(MSG.ENV_FAIL)
    }
}

export async function createCommands(body) {
    try {
        const rest = new REST({ version: '10' })
        .setToken(decode(process.env.TOKEN));
        await rest.put(
            Routes.applicationCommands(
                decode(process.env.CLIENT_ID)), 
            { body: body }
        );
        infoLog(MSG.COMMAND_SUCCESS);
    } catch (e) { 
        infoLog(MSG.COMMAND_FAIL)
    }
}

export async function createGuildCommands(body) {
    try {
        const rest = new REST({ version: '10' })
        .setToken(decode(process.env.TOKEN));
        await rest.put(
            Routes.applicationGuildCommands(
                decode(process.env.CLIENT_ID), 
                decode(process.env.SERVER_ID)), 
            { body: body }
        );
        infoLog(MSG.GCOMMAND_SUCCESS);
    } catch (e) { 
        infoLog(MSG.GCOMMAND_FAIL)
    }
}

export async function startBot(client) {
    try {
        console.log('────────────────────')
        console.log('　　Jjing Bot 🐕　　');
        console.log('────────────────────')
        parseEnv('.env');
        await createCommands(commands);
        await createGuildCommands(gcommands);
        await client.login(
            decode(process.env.TOKEN)
        );
    } catch (e) {
        if (e.code === 'TokenInvalid') {
            errorLog(MSG.TOKEN_INVALID);
        } else if (e.message.includes(
            'Used disallowed intents')) {
            errorLog(MSG.DISALLOWED_INTENTS);
        } else {
            errorLog(e.message);
        }
    }
}

process.on('SIGTERM', () => {
    infoLog(MSG.QUIT);
    process.exit(0);
});

process.on('uncaughtException', (e) => {
    errorLog(e);
});

process.on('unhandledRejection', (e) => {
    errorLog(e);
});