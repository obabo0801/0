// =====================
// File
// =====================

import path from 'path';

import {
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
    appendFileSync
} from 'fs';

export function readFile(file) {
    const root = process.cwd();
    const f = path.join(root, file);
    if (!existsSync(f)) return null;
    return readFileSync(f, 'utf-8');
}

export function writeFile(file, ...args) {
    const root = process.cwd();
    const f = path.join(root, file);
    if (!existsSync(path.dirname(f))) {
        mkdirSync(path.dirname(f));
    }
    writeFileSync(f, `${args.join(' ')}\n`);
}

export function appendFile(file, ...args) {
    const root = process.cwd();
    const f = path.join(root, file);
    if (!existsSync(path.dirname(f))) {
        mkdirSync(path.dirname(f));
    }
    appendFileSync(f, `${args.join(' ')}\n`);
}