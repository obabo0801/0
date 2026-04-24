// =====================
// Logger
// =====================

import path from 'path';

import {
    readFile,
    writeFile,
    appendFile
} from '#file';

import {
    getDate,
    getTime
} from '#time';

export function readLog(file) {
    return readFile(
        path.join('logs', file));
}

export function writeLog(file, ...args) {
    return writeFile(
        path.join('logs', file), ...args);
}

export function appendLog(file, ...args) {
    return appendFile(
        path.join('logs', file), ...args);
}

export function sendLog(type, ...args) {
    const s = `[${getTime()}] ` +
    `[${type}] ${args.join(' ')}`
    if (type === 'ERROR')
    {
        console.error(s);
    } else if (type == 'WARN') {
        console.warn(s);
    } else {
        console.info(s);
    }
    appendLog(`${getDate()}.log`, s);
}

export function commandLog(...args) {
    console.log('');
    sendLog('COMMAND', ...args);
}

export function slashLog(i, ...args) {
    console.log('');
    const name = (
        i.member.nickname ??
        i.user.globalName ??
        i.user.username);
    sendLog('SLASH', name, i.commandName, ...args);
}

export function messageLog(m, ...args) {
    console.log('');
    const name = m.member.displayName ?? ''
    sendLog('MESSAGE', name, m.content, ...args);
}

export function infoLog(...args) {
    sendLog('INFO', ...args);
}

export function errorLog(...args) {
    sendLog('ERROR', ...args);
}

export function warnLog(...args) {
    sendLog('WARN', ...args);
}