@echo off

:uninstall
set base_dir=%~dp0
pushd %base_dir%
C:\Windows\Microsoft.NET\Framework\v4.0.30319\InstallUtil.exe /u WindowsService1.exe
pause

:batexit
exit
