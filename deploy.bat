@echo off
set PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI
"C:\Program Files\Git\cmd\git.exe" config --global user.name "pife0601"
"C:\Program Files\Git\cmd\git.exe" config --global user.email "pife0601@users.noreply.github.com"
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Update"
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\GitHub CLI\gh.exe" repo create titration --public --source=. --remote=origin
"C:\Program Files\Git\cmd\git.exe" push -u origin main
cmd /c npm run deploy
