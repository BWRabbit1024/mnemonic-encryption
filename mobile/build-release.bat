@echo off
setlocal enabledelayedexpansion

echo ====================================
echo Building Release APK with Auto Version Bump
echo ====================================
echo.

REM Set Java environment
echo [1/5] Setting up Java...
set "JAVA_HOME=D:\00_Program\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME: %JAVA_HOME%
echo.

REM Set Android SDK
echo [2/5] Setting up Android SDK...
set "ANDROID_HOME=D:\00_Program\Android\SDK_Components_Setup"
set "PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin"
echo ANDROID_HOME: %ANDROID_HOME%
echo.

REM Bump version
echo [3/5] Bumping version number...
node scripts\bump-version.js
if %ERRORLEVEL% NEQ 0 (
    echo Version bump failed!
    pause
    exit /b 1
)
echo.

REM Read the new version from app.json
echo [4/5] Reading new version...
for /f "tokens=2 delims=:, " %%a in ('findstr /C:"\"version\"" app.json') do (
    set VERSION=%%a
    set VERSION=!VERSION:"=!
)
echo New version: %VERSION%
echo.

REM Build release APK
echo [5/5] Building release APK...
echo This will take 5-10 minutes...
echo.
call npx expo run:android --variant release

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================
    echo BUILD FAILED
    echo ====================================
    pause
    exit /b 1
)

REM Find and rename the APK
echo.
echo [6/5] Renaming APK with version number...
set "BUILD_DIR=android\app\build\outputs\apk\release"
if exist "%BUILD_DIR%\app-release.apk" (
    move "%BUILD_DIR%\app-release.apk" "%BUILD_DIR%\MnemonicEncryption-v%VERSION%.apk"
    echo APK renamed to: MnemonicEncryption-v%VERSION%.apk
    echo APK location: %BUILD_DIR%\MnemonicEncryption-v%VERSION%.apk
) else (
    echo Warning: Could not find app-release.apk
)

echo.
echo ====================================
echo BUILD SUCCESS!
echo ====================================
echo.
echo Version: %VERSION%
echo APK: %BUILD_DIR%\MnemonicEncryption-v%VERSION%.apk
echo.
pause

endlocal
