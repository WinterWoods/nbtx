@echo off
start cmd /k "cd src&&npm run build"
cd nwjs
start nw.exe ..
exit
