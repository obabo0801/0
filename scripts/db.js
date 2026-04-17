// =====================
// DB
// =====================

import { google } from 'googleapis';
import { MSG } from '#index';
import { decode } from '#utils';
import { sendLog, infoLog, errorLog } from '#logger';

const normalize = v => String(v ?? '').trim();

let id, title, auth, sheets;

export async function request(sheetId) {
    id = sheetId;
}

export async function create() {
    console.log('');
    createAuth();
    await createSheets();
}

export function createAuth() {
    try {
        const k = decode(process.env.CACHE);
        const s = decode(process.env.SCOPES);
        infoLog(MSG.AUTH_SUCCESS);
        auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(k), scopes: s
        });
        return true;
    } catch (e) {
        errorLog(MSG.AUTH_FAIL);
        if (e.code === undefined) {
            errorLog(MSG.AUTH_INVALID);
        } else {
            if (!httpError(e))
            {
                errorLog(e.message);
            }
         }
        return false;
    }
}

export async function createSheets() {
    try {
        const c = await auth.getClient();
        sheets = google.sheets({version: `v4`, auth: c});
        infoLog(MSG.SHEET_SUCCESS);
        return true;
    } catch (e) {
        errorLog(MSG.SHEET_FAIL);
        if (e.code === undefined) {
            errorLog(MSG.AUTH_INVALID);
        } else {
            if (!httpError(e))
            {
                errorLog(e.message);
            }
        }
        return false;
    }
}

export async function isReady() {
    try {
        const { data } =  await sheets
        .spreadsheets.get({
            spreadsheetId: id
        });
        title = data.properties.title;
        sendLog('READY', title);
        return { ok: true, code: null };
    } catch (e) {
        if (!httpError(e))
        {
            errorLog(e.message);
        }
        title = null;
        return { ok: false, code: e.code };
    }
}

export async function get(range) {
    try {
        sendLog('GET', range);
        const { data } =  await sheets
        .spreadsheets.values.get({
            spreadsheetId: id, range: range
        });
        return data.values;
    } catch (e) {
        if (!httpError(e))
        {
            errorLog(e.message);
        }
        return null;
    }
}

export async function set(range, ...args) {
    try {
        sendLog('SET', range, ...args);
        await sheets.spreadsheets.values.update({
            spreadsheetId: id, range: range, 
            valueInputOption: 'USER_ENTERED', 
            requestBody: {values: [args]}}
        );
        return true;
    } catch (e) {
        if (!httpError(e))
        {
            errorLog(e.message);
        }
        return false;
    }
}

export async function find(range, col, value) {
    try {
        const rows = await get(range);
        if (!rows) return null;;
        sendLog('FIND', col, value);
        return rows.find(r => r[col] && 
            normalize(r[col]) === normalize(value)
        );
    } catch (e) {
        if (!httpError(e))
        {
            errorLog(e.message);
        }
        return null;
    }
}

export async function findIndex(range, col, value) {
    try {
        const rows = await get(range);
        if (!rows) return { index: null, row: null };
        const index = rows.findIndex   (r => r[col] && 
            normalize(r[col]) === normalize(value)
        );
        sendLog('FIND', col, value);
        return {
            index: index === -1 ? null : index,
            row: index === -1 ? null : rows[index]
        };
    } catch (e) {
        if (!httpError(e))
        {
            errorLog(e.message);
        }
        return { index: null, row: null };
    }
}

export async function update(range, row, ...args) {
    try {
        const cell = range.split('!')[1].split(':')[0];
        const col = cell.replace(/[0-9]/g, '');
        const r = `${range.split('!')[0]}!${col}${row + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: id, range: r, 
            valueInputOption: 'USER_ENTERED', 
            requestBody: {values: [args]}}
        );
        sendLog('SET', title, r, ...args);
        return true;
    } catch (e) {
        if (!httpError(e))
        {
            errorLog(e.message);
        }
        return false;
    }
}

export async function append(range, ...args) {
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: id, range: range, 
            valueInputOption: 'USER_ENTERED', 
            requestBody: {values: [args]}}
        );
        sendLog('APPEND', title, range, ...args);
        return true;
    } catch (e) {
        if (!httpError(e))
        {
            errorLog(e.message);
        }
        return false;
    }
}

export const httpError = (e) => {
    const msg = {
        400: MSG.ERROR400,
        401: MSG.ERROR401,
        403: MSG.ERROR403,
    }[e.code];

    if (!msg) return false;

    errorLog(msg);
    return true;
}