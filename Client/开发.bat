@echo off
start cmd /k "cd src&&npm run debug"
cd nwjs
start nw.exe ..
exit
