// =====================
// Sheets
// =====================

import {
    google
} from 'googleapis';

import {
    MSG
} from '#index';

import {
    infoLog,
    errorLog
} from '#logger';

export let main, fund;

export async function createSheets() {
    main = await createSheet(process.env.MAIN_ID);
    fund = await createSheet(process.env.FUND_ID);
}

export async function createSheet(sheetId) {
    try {
        const sheet = new Sheet(sheetId);
        await sheet.initialize();

        infoLog(MSG.AUTH_SUCCESS);

        const r = await sheet.isReady();
        if (r.ok) {
            infoLog(MSG.SHEET_SUCCESS);
        } else {
            infoLog(MSG.SHEET_FAIL);
        }
        return sheet;
    } catch (e) {
        errorLog(MSG.AUTH_FAIL);
        return null;
    }
}

export class Sheet {

    constructor(sheetId) {
        this.auth = new google.auth.GoogleAuth({
            credentials: process.env.CACHE, scopes: process.env.SCOPES
        });
        
        this.sheetId = sheetId;
        this.cache = new Map();
    }

    async initialize() {
        const client = await this.auth.getClient();
        this.sheets = google.sheets({ version: 'v4', auth: client });
    }

    normalize(value) {
        return String(value ?? '').trim();
    }

    buildRange(range, row) {
        const [sName, cRange] = range.split('!');
        const cStart = cRange.split(':')[0];
        const column = cStart.replace(/[0-9]/g, '');

        return `${sName}!${column}${row + 1}`;
    }

    async isReady() {
        try {
            await this.sheets.spreadsheets.get({
                spreadsheetId: this.sheetId
            });

            return { ok: true, code: null };
        } catch (e) {
            return { ok: false, code: e.code };
        }
    }

    async get(range, { option = 'FORMATTED_VALUE', cache = true } = {}) {
        const key = `${range}:${option}`;
        const cached = this.cache.get(key);

        if (cache && cached && Date.now() - cached.time < 5000) {
            return cached.data.map(row => [...row]);
        }

        const { data } = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range,
            valueRenderOption: option
        });

        const values = data.values ?? [];

        if (cache) {
            this.cache.set(key, { time: Date.now(), data: values });
        }
        
        return values;
    }

    async set(range, ...values) {
        await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {values: [values]}
        });

        this.clear(range);
    }

    async find(range, col, value, options = {}) {
        const rows = await this.get(range, options);
        const target = this.normalize(value);

        return rows.find(row => 
            this.normalize(row[col]) === target
        ) ?? null;
    }

    async index(range, col, value, options = {}) {
        const rows = await this.get(range, options);
        const target = this.normalize(value);
        
        const index = rows.findIndex(row => 
            this.normalize(row[col]) === target
        );

        return index === -1
            ? { result: null, row: null }
            : { result, row: rows[index] };
    }

    async append(range, ...values) {
        await this.sheets.spreadsheets.values.append({
            spreadsheetId: this.sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {values: [values]}
        });
    }

    async update(range, row, ...values) {
        await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.sheetId,
            range: this.buildRange(range, row),
            valueInputOption: 'USER_ENTERED',
            requestBody: {values: [values]}
        });
    }

    clear(range = null) {
        if (!range) return this.cache.clear();

        for (const key of this.cache.keys()) {
            if (key.startsWith(range)) {
                this.cache.delete(key);
            }
        }
    }
}