@echo off
setlocal enabledelayedexpansion

echo ====================================
echo Building Release AAB (App Bundle)
echo ====================================
echo.

REM Set Java environment
echo [1/4] Setting up Java...
set "JAVA_HOME=D:\00_Program\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME: %JAVA_HOME%
echo.

REM Set Android SDK
echo [2/4] Setting up Android SDK...
set "ANDROID_HOME=D:\00_Program\Android\SDK_Components_Setup"
set "PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin"
echo ANDROID_HOME: %ANDROID_HOME%
echo.

REM Read current version from app.json
echo [3/4] Reading version...
for /f "tokens=2 delims=:, " %%a in ('findstr /C:"\"version\"" app.json') do (
    set VERSION=%%a
    set VERSION=!VERSION:"=!
)
echo Current version: %VERSION%
echo.

REM Build release AAB
echo [4/4] Building release AAB...
echo This will take 5-10 minutes...
echo.

cd android
call .\gradlew.bat bundleRelease

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================
    echo BUILD FAILED
    echo ====================================
    cd ..
    pause
    exit /b 1
)

cd ..

REM Find and rename the AAB
echo.
echo [5/4] Renaming AAB with version number...
set "BUILD_DIR=android\app\build\outputs\bundle\release"
if exist "%BUILD_DIR%\app-release.aab" (
    copy "%BUILD_DIR%\app-release.aab" "%BUILD_DIR%\MnemonicEncryption-v%VERSION%.aab"
    echo AAB created: MnemonicEncryption-v%VERSION%.aab
    echo AAB location: %BUILD_DIR%\MnemonicEncryption-v%VERSION%.aab
    echo.
    echo Original: %BUILD_DIR%\app-release.aab
) else (
    echo Warning: Could not find app-release.aab
)

echo.
echo ====================================
echo BUILD SUCCESS!
echo ====================================
echo.
echo Version: %VERSION%
echo AAB: %BUILD_DIR%\MnemonicEncryption-v%VERSION%.aab
echo.
echo Next steps:
echo 1. Upload AAB to Google Play Console Internal Testing
echo 2. Once uploaded, API Access section will appear
echo 3. Grant service account permissions
echo.
pause

endlocal
