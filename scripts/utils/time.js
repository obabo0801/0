// =====================
// Time
// =====================

export const pad = v => String(v)
.padStart(2, '0');

export function getYear() {
    const d = new Date();
    return d.getFullYear();
}

export function getMonth() {
    const d = new Date();
    return pad(d.getMonth() + 1);
}

export function getDate() {
    const d = new Date();

    return (
        `${d.getFullYear()}-` +
        `${pad(d.getMonth() + 1)}-` +
        `${pad(d.getDate())}`
    );
}

export function getTime() {
    const d = new Date();

    return (
        `${pad(d.getMonth() + 1)}/` +
        `${pad(d.getDate())} ` +
        `${pad(d.getHours())}:` +
        `${pad(d.getMinutes())}`
    );
}