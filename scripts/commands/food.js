// =====================
// Food
// =====================

import {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags
} from 'discord.js';

export const data = (
    new SlashCommandBuilder()
    .setName('food')
    .setDescription('food')
    .addStringOption(o =>
        o.setName('add')
        .setDescription('add')
    )
);

export async function execute(i) {
    await i.deferReply({ flags: MessageFlags.Ephemeral });

    const s = i.options.getString('add');

    if (!s) {
        return i.editReply({ content: 'input' });
    }

    const embed = new EmbedBuilder()
        .setTitle('food')
        .setDescription(`${s}`);
    
    return i.editReply({ embeds: [embed] });
}