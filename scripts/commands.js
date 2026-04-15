// =====================
// Commands
// =====================

import { parse } from 'dotenv';
import { SlashCommandBuilder, REST, Routes } from 'discord.js';
import { MSG } from '#index';
import { httpError } from '#db';
import { readFile, decode } from '#utils';
import { infoLog, errorLog } from '#logger';

const commands = [
    new SlashCommandBuilder()
    .setName('멤버')
    .setDescription('멤버')
    .addUserOption(o =>
        o.setName('대상')
        .setDescription('대상')
        .setRequired(true)
    )
    .toJSON(),
    
    new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping')
    .addBooleanOption(o =>
        o.setName('boolean')
        .setDescription('boolean')
        .setRequired(true)
    )
    .toJSON()
];

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
        if (!httpError(e))
        {
            infoLog(MSG.ENV_FAIL)
        }
    }
}

export async function createCommands() {
    try {
        const rest = new REST({ version: '10' })
        .setToken(decode(process.env.TOKEN));
        await rest.put(
            Routes.applicationCommands(
                decode(process.env.CLIENT_ID)), 
            { body: commands }
        );
        infoLog(MSG.COMMAND_SUCCESS);
    } catch (e) { 
        if (!httpError(e))
        {
            infoLog(MSG.COMMAND_FAIL)
        }
    }
}

export async function createGuildCommands() {
    try {
        const rest = new REST({ version: '10' })
        .setToken(decode(process.env.TOKEN));
        await rest.put(
            Routes.applicationGuildCommands(
                decode(process.env.CLIENT_ID), 
                decode(process.env.GUILD_ID)), 
            { body: commands }
        );
        infoLog(MSG.COMMAND_SUCCESS);
    } catch (e) { 
        if (!httpError(e))
        {
            infoLog(MSG.COMMAND_FAIL)
        }
    }
}

export async function startBot(client) {
    try {
        parseEnv('.env');
        await createGuildCommands();
        await client.login(
            decode(process.env.TOKEN)
        );
    } catch (e) {
        if (e.code === 'TokenInvalid') {
            errorLog(MSG.TOKEN_INVALID);
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
    errorLog(e.message);
});

process.on('unhandledRejection', (e) => {
    errorLog(e.message);
});