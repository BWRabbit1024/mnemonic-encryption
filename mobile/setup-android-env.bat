@echo off
echo Setting up Android SDK environment variables...

set ANDROID_HOME=D:\00_Program\Android\SDK_Components_Setup
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin

echo ANDROID_HOME set to: %ANDROID_HOME%
echo PATH updated with Android tools

echo.
echo Testing adb...
adb version

echo.
echo Environment setup complete!
echo You can now run: npx expo run:android