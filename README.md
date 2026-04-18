<h1 align="center">🐕 Jjing Bot</h1>

<p align="center">
Discord + Google Sheets 데이터 조회 자동화 봇
</p>

---

## 📌 개요

Jjing Bot은 Discord 슬래시 명령어를 통해  
Google Sheets 데이터를 조회하고 관리하는 봇입니다.

---

## ⚙️ 기능
- 💬 Discord Slash Commands
- 📊 Google Sheets API 연동
- 🔎 사용자 기반 데이터 검색
- 🧾 자동 로그 저장 (날짜별)

---

## 📁 프로젝트 구조
```bash
index.js        : 메인 실행 파일

scripts/
 ├─ commands.js : 슬래시 명령어 등록
 ├─ db.js       : Google Sheets API 처리
 ├─ logger.js   : 로그 기록 및 시스템 관리
 └─ utils.js    : 파일 / 시간 / Base64
```
---

## 🚀 실행 방법

### 💻 직접 실행
```bash
npm install dotenv discord.js googleapis
node index.js
```

### 🪟 Windows 실행
start.bat 실행

---

## 🔐 .env (⚠️ **절대 공개 금지**)

### TOKEN=봇 토큰
### CLIENT_ID=클라이언트 ID
### SERVER_ID=디스코드 서버 ID
### CHANNEL_ID=메시지 채널 ID

### CACHE=Google Cloud Service Account JSON (Base64)
### SCOPES=https://www.googleapis.com/auth/spreadsheets

---

## 📊 Google Sheets API 기능

- request(id) → 시트 선택
- get(range) → 데이터 조회
- find(range, col, value) → 값 검색
- set(range, ...args) → 데이터 수정
- update(range, row, args) → 특정 행 수정
- append(range, ...args) → 데이터 추가

---

## 🧾 로그 시스템

logs/YYYY-MM-DD.log

| 타입   | 설명 |
|--------|-------------|
| INFO   | 일반 |
| ERROR  | 에러 |
| SLASH  | 명령어 |
| CHAT   | 채팅 |
