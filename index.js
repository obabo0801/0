// =====================
// Index
// =====================

import {
    config
} from 'dotenv';
config({quiet: true});

import {
    startBot
} from '#client';

export const MSG = {
    ENV_SUCCESS: '📄 .env 로드 성공',
    ENV_FAIL: '.env 로드 실패',
    ENV_INVALID: '.env 파일을 찾을 수 없습니다',

    COMMAND_SUCCESS: '🌍 Global Commands 등록',
    COMMAND_FAIL: 'Global Commands 실패',

    GCOMMAND_SUCCESS: '🏠 Guild Commands 등록',
    GCOMMAND_FAIL: 'Guild Commands 실패',
    
    LOGIN_SUCCESS: '🟢 Discord 연결 완료',
    LOGIN_FAIL: '🔴 Discord 연결 실패',
    TOKEN_INVALID: '유효하지 않은 토큰입니다',
    DISALLOWED_INTENTS: '권한이 없습니다 ',

    AUTH_SUCCESS: '🔐 Google 인증 성공',
    AUTH_FAIL: 'Google 인증 실패',
    AUTH_INVALID: '인증 정보를 불러올 수 없습니다',

    SHEET_SUCCESS: '📊 Sheets 연결 완료',
    SHEET_FAIL: 'Sheets 연결 실패',

    ERROR400: '잘못된 요청 (400)',
    ERROR401: '인증 실패 (401)',
    ERROR403: '접근 권한 없음 (403)',

    QUIT: '프로그램을 종료합니다',
};

startBot();