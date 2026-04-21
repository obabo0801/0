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

export function getCommand(name) {
    return list.find(cmd =>
        cmd.data?.name === name
    );
}

export function getButton(id) {
    return list.find(cmd =>
        cmd.customId === id
    );
}

export function getModal(id) {
    return list.find(cmd =>
        cmd.customId === id
    );
}

export function getMessage(m) {
    return list.find(cmd =>
        m.toLowerCase()
        .startsWith(`!${cmd.name}`)
    );
}

export async function createGCommands() {
    try {
        const rest = new REST({ version: '10' })
        .setToken(process.env.TOKEN);
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.SERVER_ID), 
            { body: list.map(cmd => 
                cmd.data.toJSON()) }
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