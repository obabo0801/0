// =====================
// Link
// =====================

import {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags
} from 'discord.js';

function url(id) {
    return `https://docs.google.com/spreadsheets/d/${id}/edit`
}

export const data = (
    new SlashCommandBuilder()
    .setName('link')
    .setDescription('link')
);

export async function execute(i) {
    await i.deferReply({ flags: MessageFlags.Ephemeral });

    const embed = new EmbedBuilder()
        .setTitle('🔗 링크 바로가기');
    
    const btn1 = new ButtonBuilder()
        .setLabel('회사 공금')
        .setStyle(ButtonStyle.Link)
        .setURL(url(process.env.FUND_ID))
        .setEmoji('💰');
    
    const btn2 = new ButtonBuilder()
        .setLabel('LAC 정보')
        .setStyle(ButtonStyle.Link)
        .setURL(url(process.env.MAIN_ID))
        .setEmoji('⭐');
    
    const row = new ActionRowBuilder()
        .addComponents([btn1, btn2]);

    return i.editReply({
        embeds: [embed],
        components: [row]
    });
}