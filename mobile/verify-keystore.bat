@echo off
echo ============================================
echo Keystore Password Verification
echo ============================================
echo.
echo This will test your keystore password.
echo You'll be prompted to enter the password.
echo.
echo If the password is CORRECT: You'll see key details
echo If the password is WRONG: You'll see "keystore password was incorrect"
echo.
pause
echo.
"D:\00_Program\Android\Android Studio\jbr\bin\keytool.exe" -list -v -keystore "my-upload-key.keystore" -alias my-key-alias
echo.
echo ============================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Your password is correct.
) else (
    echo FAILED! Your password is incorrect.
)
echo ============================================
pause
