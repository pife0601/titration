@echo off
set PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Update layout for mobile"
"C:\Program Files\Git\cmd\git.exe" push
cmd /c npm run deploy
