// =====================
// Handler
// =====================

import * as 
commands from '#loader';

import {
    infoLog,
    errorLog
} from '#logger';

export async function handleInteraction(i) {
    const cmd = commands
    .get(i.commandName);
    if (!cmd) return;

    try {
        await cmd.execute(i);
    } catch (e) {
        errorLog(e);
    }
}

export async function handleMessage(m) {
    if (m.content === '!0') {
        m.channel.sendTyping();
        if ((await isReady()).ok)
        {
            m.reply('0');
        }
    }
}