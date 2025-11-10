@echo off
set JAVA_HOME=D:\00_Program\Android\Android Studio\jbr
set ANDROID_HOME=D:\00_Program\Android\SDK_Components_Setup
set GRADLE_BUILD=release
cd android
call gradlew.bat assembleRelease
