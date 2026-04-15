// =====================
// Logger
// =====================

import { getTime, getDate, readFile, writeFile, appendFile } from '#utils';
import path from 'path';

export function readLog(file) {
    return readFile(path.join('logs', file));
}

export function writeLog(file, ...args) {
    return writeFile(path.join('logs', file), ...args);
}

export function appendLog(file, ...args) {
    return appendFile(path.join('logs', file), ...args);
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

export function cmdLog(i, ...args) {
    sendLog('CMD', i.user.globalName, 
        i.commandName, ...args);
}

export function chatLog(m, ...args) {
    sendLog('CHAT', m.member.displayName, 
        m.content, ...args);
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