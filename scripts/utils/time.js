// =====================
// Time
// =====================

const pad = v => String(v)
.padStart(2, '0');

export function getDate() {
    const n = new Date();
    return (
        `${n.getFullYear()}-` +
        `${pad(n.getMonth() + 1)}-` +
        `${pad(n.getDate())}`
    );
}

export function getTime() {
    const n = new Date();
    return (
        `${pad(n.getMonth() + 1)}/` +
        `${pad(n.getDate())} ` +
        `${pad(n.getHours())}:` +
        `${pad(n.getMinutes())}`
    );
}