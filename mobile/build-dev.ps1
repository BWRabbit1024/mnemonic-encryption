# PowerShell Build Script for Development App with Hot Reload

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Building Development App with Hot Reload" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Set Java environment
Write-Host "[1/3] Setting up Java..." -ForegroundColor Yellow
$env:JAVA_HOME = "D:\00_Program\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green
Write-Host ""

# Set Android SDK
Write-Host "[2/3] Setting up Android SDK..." -ForegroundColor Yellow
$env:ANDROID_HOME = "D:\00_Program\Android\SDK_Components_Setup"
$env:PATH = "$env:PATH;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Green
Write-Host ""

# Build and install app
Write-Host "[3/3] Building and installing app..." -ForegroundColor Yellow
Write-Host "This will take 3-5 minutes on first build..." -ForegroundColor Cyan
Write-Host ""

npx expo run:android

if ($LASTEXITCODE -ne 0) {
    Write-Host "" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host "BUILD FAILED" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    exit 1
}

Write-Host "" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "BUILD SUCCESS!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "The app is now installed on your phone." -ForegroundColor Cyan
Write-Host "Metro bundler is running - code changes will hot reload automatically!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the Metro bundler when you're done." -ForegroundColor Yellow
Write-Host ""
