// =====================
// Handler
// =====================

import * as 
loader from '#loader';

export async function handleInteraction(i) {
    if (i.isChatInputCommand()) {
        const h = loader.findCommands(i.commandName);
        if (h?.slush) return await h.slush(i);
    }

    if (i.isAutocomplete()) {
        const h = loader.findCommands(i.commandName);
        if (h?.auto) return await h.auto(i);
    }

    if (i.isButton()) {
        const h = loader.findCustomIds(i.customId);
        if (h?.button) return await h.button(i);
    }

    if (i.isStringSelectMenu()) {
        const h = loader.findCustomIds(i.customId);
        if (h?.menu) return await h.menu(i);
    }

    if (i.isModalSubmit()) {
        const h = loader.findCustomIds(i.customId);
        if (h?.modal) return await h.modal(i);
    }
}

export async function handleMessage(m) {
    if (m.content.startsWith('!')) {
        const msg = loader.findMessages(m.content);
        if (msg) return msg.message(m);
    }
}