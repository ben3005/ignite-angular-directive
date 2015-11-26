@ECHO OFF
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL
if "%ERRORLEVEL%"=="0" GOTO :CHROMEOPEN
GOTO :CHROMECLOSED

:CHROMEOPEN
ECHO Chrome is open
set /p closeChrome=Close and re-open with disabled security? [y/n]?:
IF "%closeChrome%"=="y" GOTO :CLOSECHROME
IF "%closeChrome%"=="Y" GOTO :CLOSECHROME
GOTO :CHROMECLOSED

:CLOSECHROME
TASKKILL /F /IM chrome.exe
TIMEOUT /T 1 /NOBREAK

:CHROMECLOSED
start chrome.exe Chrome --args --disable-web-security
ionic serve