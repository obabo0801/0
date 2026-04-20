<h1 align="center">🐕 Jjing Bot</h1>

<p align="center">
Discord + Google Sheets 데이터 조회 자동화 봇
</p>

---

## 📌 개요

Jjing Bot은 Discord 슬래시 명령어를 통해 Google Sheets 데이터를 Discord에서 쉽게 조회하고 관리할 수 있는 봇입니다.

---

## ⚙️ 기능
* 💬 Slash Command 인터랙션
* 📊 Google Sheets 연동
* 📝 로그 시스템 (파일 저장)

---

## 📁 프로젝트 구조
```

├── index.js

├── core/
│   ├── client.js
│   └── handler.js

├── commands/
│   ├── food.js
│   ├── link.js
│   └── loader.js

├── services/
│   └── sheets.js

├── utils/
│   ├── base64.js
│   ├── file.js
│   ├── logger.js
│   └── time.js
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

### MAIN_ID=정보 시트 ID
### FUND_ID=공금 시트 ID
### CACHE=Google Cloud Service Account JSON (Base64)
### SCOPES=https://www.googleapis.com/auth/spreadsheets

---

## 📊 Google Sheets API 기능

* Range 조회 (`sheet1!A:C`)
* CRUD 지원:
  * get
  * set
  * update
  * find
  * append

---

## 🧾 로그 시스템

* logs/YYYY-MM-DD.log 자동 생성
* 이벤트별 로그 기록:
  * COMMAND
  * SLASH
  * MESSAGE
  * ERROR

---

## 📄 License

MIT License
