@echo off
chcp 65001 > nul
title Jjing Bot 🐕
cd /d "%~dp0"

if not exist node_modules (
    npm install dotenv discord.js googleapis
    call "%~f0"
)

cls
node index.js
pause