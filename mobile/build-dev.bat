@echo off
setlocal

echo ====================================
echo Building Development App with Hot Reload
echo ====================================
echo.

REM Set Java environment
echo [1/3] Setting up Java...
set "JAVA_HOME=D:\00_Program\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME: %JAVA_HOME%
echo.

REM Set Android SDK
echo [2/3] Setting up Android SDK...
set "ANDROID_HOME=D:\00_Program\Android\SDK_Components_Setup"
set "PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin"
echo ANDROID_HOME: %ANDROID_HOME%
echo.

REM Build and install app
echo [3/3] Building and installing app...
echo This will take 3-5 minutes on first build...
echo.
call npx expo run:android

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================
    echo BUILD FAILED
    echo ====================================
    pause
    exit /b 1
)

echo.
echo ====================================
echo BUILD SUCCESS!
echo ====================================
echo.
echo The app is now installed on your phone.
echo Metro bundler is running - code changes will hot reload automatically!
echo.
echo Press Ctrl+C to stop the Metro bundler when you're done.
echo.

endlocal
