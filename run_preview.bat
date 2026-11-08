@echo off
chcp 65001 >nul
echo ========================================================
echo   KHOI DONG WEBSITE PORTFOLIO CONTENT MARKETING
echo   Server dang chay tai: http://localhost:5500/
echo ========================================================
cd frontend
start http://localhost:5500/index.html
python -m http.server 5500
pause
