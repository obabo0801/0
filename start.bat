@echo off
chcp 65001 > nul
title 🐕
cd /d "%~dp0"
node index.js
pause