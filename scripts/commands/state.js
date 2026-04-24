// =====================
// State
// =====================

import {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ContainerBuilder,
    MessageFlags
} from 'discord.js';

import {
    main
} from '#sheets'

import {
    slashLog
} from '#logger'

export const commands = [
    new SlashCommandBuilder()
        .setName('조회')
        .setDescription('조회')
        .addStringOption(o =>
            o.setName('이름')
            .setDescription('이름')
        )
];

export const customIds = [
    'categorySelect'
];

const createContainer  = (value) =>
    new ContainerBuilder()
    .setAccentColor(0x2b2d31)
    .addTextDisplayComponents(t =>
        t.setContent(value)
);

const addField = (c, title, value) => {
    if (!value) return;
    c
    .addSeparatorComponents(s => s)
    .addTextDisplayComponents(t =>
        t.setContent(`### ${title}\n${value}`)
    );
}

async function build(value, msg) {
    const rows = await main.find(
        '정보!A2:H', 
        0, 
        value, 
        { option: 'FORMULA' }
    );

    if (!rows) {
        const container = createContainer(
            `⚠️ ${value} 데이터가 없습니다`
        );

        await msg.edit({
            components:[container],
            flags: MessageFlags.IsComponentsV2
        });

        return setTimeout(async () => {
             msg.delete().catch(() => {});
        }, 30000);
    }

    const [name, image, gender, ssn, 
    phone, account, date, note] = rows;

    const result = createContainer(`## 👤 신원 조회 ${name}`)
        .addSeparatorComponents(s => s);
        
    const url = image?.match(/"(.*?)"/)?.[1];
        
    if (url) {
        result.addMediaGalleryComponents((g) =>
            g.addItems((item) => item.setURL(url))
        )
    }

    addField(result, '이름', name);
    addField(result, 'SSN', ssn);
    addField(result, '성별', gender);
    addField(result, '전화번호', phone);
    addField(result, '계좌번호', account);
    addField(result, '입국일', date);
    addField(result, '메모', note);

    return await msg.edit({
        components: [result],
        flags: MessageFlags.IsComponentsV2
    })
}

export async function slush(i) {
    const name = (
        i.member.nickname ??
        i.user.globalName ??
        i.user.username);

    await i.reply({
        components: [createContainer(
            `👤 ${name}님이 신원 정보를 조회 중입니다`
        )],
        flags: MessageFlags.IsComponentsV2
    });

    const msg = await i.fetchReply()

    const input = i.options.getString('이름');

    if (input) {
        slashLog(i, input);

        return await build(input, msg);
    } else {
        slashLog(i);
    }

    const rows = await main.get(
        '정보!A2:A',
        { option: 'FORMATTED_VALUE' }
    );

    const options = rows
        .filter(([v]) => v)
        .map(([label]) => ({
            label,
            value: label,
            emoji: '👤'
        }));
    
    const menu = new StringSelectMenuBuilder()
        .setCustomId(`${customIds[0]}:${msg.id}`)
        .setPlaceholder('조회할 대상을 선택해주세요')
        .addOptions(options);
    
    const container = createContainer(
            '## 👤 신원 조회'
        )
        .addSeparatorComponents(s => s)
        .addActionRowComponents(row =>
            row.setComponents(menu)
        );
    
    setTimeout(async () => {
        const now = await i.fetchReply()
        .catch(() => null);
        if (!now) return;

        if (JSON.stringify(msg.components) === 
            JSON.stringify(now.components)) {
            msg.delete().catch(() => {});
        }
    }, 90000);

    return i.followUp({
        components: [container],
        flags: MessageFlags.Ephemeral |
        MessageFlags.IsComponentsV2,
    });
}

export async function menu(i) {
    if (i.customId.startsWith(customIds[0])) {
        await i.deferUpdate();

        const selected = i.values[0];
        const [, id] = i.customId.split(':');


        const msg = await i.channel.messages
        .fetch(id).catch(() => null);
        
        if (!msg) {
            const container = createContainer(
                `⚠️ 메시지가 만료되었습니다`
            );

            i.editReply({
                components:[container],
                flags: MessageFlags.IsComponentsV2
            });

            return setTimeout(() => {
                i.deleteReply().catch(() => {});
            }, 30000);
        }

        await i.deleteReply();

        return await build(selected, msg);
    }
}