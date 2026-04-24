// =====================
// Loader
// =====================

import * as state 
from './state.js';

import {
    REST,
    Routes
} from 'discord.js';

import {
    MSG
} from '#index';

import {
    infoLog,
    errorLog
} from '#logger';

const list = [state];

export async function createGCommands() {
    try {
        const rest = new REST({ version: '10' })
        .setToken(process.env.TOKEN);
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.SERVER_ID), 
            { body: list.flatMap(cmd => 
                cmd.commands.map(c => c.toJSON())) }
        );
        infoLog(MSG.GCOMMAND_SUCCESS);
    } catch (e) { 
        errorLog(MSG.GCOMMAND_FAIL)
    }
}

export async function createCommands() {
    try {
        const rest = new REST({ version: '10' })
        .setToken(process.env.TOKEN);
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID), 
            { body: [] }
        );
        infoLog(MSG.COMMAND_SUCCESS);
    } catch (e) { 
        errorLog(MSG.COMMAND_FAIL)
    }
}

export function findCommands(name) {
    return list.find(cmd =>
        cmd.commands.some(c => c.name.startsWith(name))
    );
}

export function findCustomIds(id) {
    return list.find(cmd =>
        cmd.customIds.some(c => id.startsWith(c))
    );
}

export function findMessages(m) {
    return list.find(cmd =>
        m.toLowerCase()
        .startsWith(`!${cmd.name}`)
    );
}