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
    try {
        main = new Sheet(
            process.env.MAIN_ID);
        await main.init();

        infoLog(MSG.AUTH_SUCCESS);

        const r = await main.isReady();
        if (r.ok) {
            infoLog(MSG.SHEET_SUCCESS);
        } else {
            infoLog(MSG.SHEET_FAIL);
        }
    } catch (e) {
        infoLog(MSG.AUTH_FAIL);
    }
    
    try {
        fund = new Sheet(
            process.env.FUND_ID);
        await fund.init();
        
        infoLog(MSG.AUTH_SUCCESS);

        const r = await fund.isReady();
        if (r.ok) {
            infoLog(MSG.SHEET_SUCCESS);
        } else {
            infoLog(MSG.SHEET_FAIL);
        }
    } catch (e) {
        infoLog(MSG.AUTH_FAIL);
    }
}

export class Sheet {

    constructor(sheetId) {
        this.auth = new google.auth.GoogleAuth({
            credentials: process.env.CACHE, scopes: process.env.SCOPES
        });
        
        this.sheetId = sheetId;
    }

    async init() {
        const client = await this.auth.getClient();
        this.sheets = google.sheets({ version: 'v4', auth: client });
    }

    async isReady() {
        try {
            const { data } =  await this.sheets.spreadsheets.get({
                spreadsheetId: this.sheetId
            });

            return { ok: true, code: null };
        } catch (e) {
            this.title = null;

            return { ok: false, code: e.code };
        }
    }

    async getValues(range) {
        const { data } = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range
        });

        return data.values;
    }

    async getFormula(range) {
        const { data } = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range,
            valueRenderOption: 'FORMULA'
        });
        
        return data.values;
    }

    async set(range, ...args) {
        await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {values: [args]}
        });
    }

    async find(range, col, value) {
        const rows = await this.getFormula(range);
        if (!rows) return null;;

        const n = v => String(v ?? '').trim();

        return rows.find(row =>
            n(row[col]) === n(value)
        );
    }

    async findIndex(range, col, value) {
        const rows = await this.getFormula(range);
        if (!rows) return { index: null, row: null };

        const n = v => String(v ?? '').trim();
        
        const index = rows.findIndex(row => 
            row[col] && n(row[col]) === n(value)
        );

        return {index: index === -1 ? null : index,
            row: index === -1 ? null : rows[index]
        };
    }

    async update(range, row, ...args) {
        const [sName, sCell] = range.split('!');
        const cell = sCell.split(':')[0];
        const column = cell.replace(/[0-9]/g, '');
        const target = `${sName}!${column}${row + 1}`;

        await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.sheetId,
            range: target,
            valueInputOption: 'USER_ENTERED',
            requestBody: {values: [args]}
        });
    }

    async append(range, ...args) {
        await this.sheets.spreadsheets.values.append({
            spreadsheetId: this.sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {values: [args]}
        });
    }
}