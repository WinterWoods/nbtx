@echo off


:install
set base_dir=%~dp0
pushd %base_dir%
C:\Windows\Microsoft.NET\Framework\v4.0.30319\InstallUtil.exe NBTXService.exe
@echo Æô¶¯·þÎñ
net start nbtx
pause

:batexit
exit
