// =====================
// State
// =====================

import {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    MessageFlags
} from 'discord.js';

import {
    main,
    fund
} from '#sheets'

export const data = (
    new SlashCommandBuilder()
    .setName('food')
    .setDescription('food')
    .addStringOption(o =>
        o.setName('add')
        .setDescription('add')
    )
);

export async function slush(i) {
    console.log(i);
}

export async function button(i) {
    console.log(i);
}

export async function modal(i) {
    console.log(i);
}

export async function message(m) {
    console.log(m);
}