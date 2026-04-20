// =====================
// Handler
// =====================

import * as 
commands from '#loader';

import {
    main,
    fund
} from '#sheets';

import {
    infoLog,
    errorLog
} from '#logger';

export async function handleInteraction(i) {
    if (i.isChatInputCommand()) {
        const cmd = commands
        .get(i.commandName);
        if (!cmd) return;

        try {
            await cmd.execute(i);
        } catch (e) {
            errorLog(e);
        }
    }
}

export async function handleMessage(m) {
    if (m.content === '!0') {
        m.channel.sendTyping();
        if ((await main.isReady()).ok)
        {
            m.reply('0');
        }
    }
}