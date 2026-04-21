// =====================
// Handler
// =====================

import * as 
loader from '#loader';

import {
    main,
    fund
} from '#sheets';

import {
    infoLog,
    errorLog
} from '#logger';

export async function handleInteraction(i) {
    if (i.isAutocomplete()) {
        const ace = loader.getCommand(i.commandName);
        if (ace) return ace.autocomplete(i);
    }

    else if (i.isChatInputCommand()) {
        const cmd = loader.getCommand(i.commandName);
        if (cmd) return cmd.slush(i);
    }

    else if (i.isButton()) {
        const btn = loader.getButton(i.customId);
        if (btn) return btn.button(i);
    }

    else if (i.isModalSubmit()) {
        const mdl = loader.getModal(i.customId);
        if (mdl) return mdl.modal(i);
    }
}

export async function handleMessage(m) {
    if (m.content.startsWith('!')) {
        const msg = loader.getMessage(m.content);
        if (msg) return msg.message(m);
    }
}