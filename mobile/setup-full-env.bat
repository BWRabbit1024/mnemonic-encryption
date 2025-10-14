@echo off
echo ====================================
echo Setting up Full Development Environment
echo ====================================
echo.

REM Set JAVA_HOME (using Android Studio's JBR)
echo [1/3] Setting up Java...
set JAVA_HOME=D:\00_Program\Android\Android Studio\jbr
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo WARNING: Java not found at %JAVA_HOME%
    echo Please check Android Studio installation
    pause
    exit /b 1
)
set PATH=%JAVA_HOME%\bin;%PATH%
echo JAVA_HOME set to: %JAVA_HOME%
java -version
echo.

REM Set Android SDK
echo [2/3] Setting up Android SDK...
set ANDROID_HOME=D:\00_Program\Android\SDK_Components_Setup
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin
echo ANDROID_HOME set to: %ANDROID_HOME%
echo.

REM Test ADB
echo [3/3] Testing ADB connection...
adb version
echo.
adb devices
echo.

echo ====================================
echo Environment setup complete!
echo ====================================
echo.
echo You can now run:
echo   npx expo run:android
echo.
pause
