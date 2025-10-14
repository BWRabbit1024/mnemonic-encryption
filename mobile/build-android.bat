@echo off
echo Setting up Android build environment...

REM Set environment variables
set JAVA_HOME=D:\00_Program\Android\Android Studio\jbr
set ANDROID_HOME=D:\00_Program\Android\SDK_Components_Setup
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%JAVA_HOME%\bin

echo JAVA_HOME=%JAVA_HOME%
echo ANDROID_HOME=%ANDROID_HOME%

echo.
echo Cleaning build cache...
cd android
call gradlew clean
echo.
echo Build cache cleaned!

echo.
echo You can now use Android Studio to build the project.
echo Or run: gradlew assembleDebug
pause