// =====================
// State
// =====================

import {
    ContainerBuilder,
    SlashCommandBuilder,
    MessageFlags
} from 'discord.js';

import {
    main,
    fund
} from '#sheets'

export const data = (
    new SlashCommandBuilder()
    .setName('조회')
    .setDescription('조회')
    .addStringOption(o =>
        o.setName('이름')
        .setDescription('이름')
        .setRequired(true)
        .setAutocomplete(true)
    )
);

export async function autocomplete(i) {
    const focused = i.options.getFocused();

    const f = await main.get('정보!A2:A');
    const names = f.map(r => r[0]);

    const filtered = names
        .filter(n => n.includes(focused ?? ''))
        .slice(0, 25);
    
    return i.respond(
        filtered.map(n => ({name: n, value: n}))
    );
}

export async function slush(i) {
    await i.deferReply();

    const input = i.options.getString('이름');

    if (!input) {
        await i.editReply({
            content: '이름이 입력되지 않았습니다.',
            flags: MessageFlags.Ephemeral
        });
        return setTimeout(async () => {
            i.deleteReply().catch(() => {});
        }, 30000);
    }

    const s = await main.find('정보!A2:H', 0, input);

    if (!s) {
        await i.editReply({
            content: `${input}에 대한 데이터를 찾을 수 없습니다`,
            flags: MessageFlags.Ephemeral
        });
        return setTimeout(async () => {
            i.deleteReply().catch(() => {});
        }, 3000);
    }

    const [name, image, gender, ssn, 
        phone, account, date, note] = s;
    
    const container = new ContainerBuilder();
    container.setAccentColor(0x2b2d31);
    container.addTextDisplayComponents((t) =>
        t.setContent(`## 👤 신원 조회 ${name}`)
    )
    container.addSeparatorComponents(s => s)

    const match = image?.match(/"(.*?)"/);
    const url = match ? match[1] : undefined;
    if (url) {
        container.addMediaGalleryComponents((g) =>
            g.addItems((item) => item.setURL(url))
        )
    }

    if (name) {
        container.addTextDisplayComponents((t) =>
            t.setContent(`### 이름\n${name}`)
        )
    }
    
    if (ssn) {
        container.addSeparatorComponents(s => s)
        container.addTextDisplayComponents((t) =>
            t.setContent(`### SSN\n${ssn}`)
        )
    }

    if (gender) {
        container.addSeparatorComponents(s => s)
        container.addTextDisplayComponents((t) =>
            t.setContent(`### 성별\n${gender}`)
        )
    }
    
    if (phone) {
        container.addSeparatorComponents(s => s)
        container.addTextDisplayComponents((t) =>
            t.setContent(`### 전화번호\n${phone}`)
        )
    }

    if (account) {
        container.addSeparatorComponents(s => s)
        container.addTextDisplayComponents((t) =>
            t.setContent(`### 계좌번호\n${account}`)
        )
    }

    if (date) {
        container.addSeparatorComponents(s => s)
        container.addTextDisplayComponents((t) =>
            t.setContent(`### 입국일\n${date}`)
        );
    }

    if (note) {
        container.addSeparatorComponents(s => s)
        container.addTextDisplayComponents((t) =>
            t.setContent(`### 메모\n${note}`)
        );
    }

    return await i.editReply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });
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