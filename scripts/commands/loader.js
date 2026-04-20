// =====================
// Loader
// =====================

import * as food from './food.js';
import * as link from './link.js';

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

const list = [food, link];

export function get(name) {
    return list.find(cmd => cmd.data.name === name);
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
//        errorLog(MSG.GCOMMAND_FAIL)
        errorLog(e);
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