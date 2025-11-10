# Release v1.2.0 - UX & Security Enhancements

## 🎨 User Experience Improvements

We've focused on making the app lock and PIN management experience smoother and more intuitive with this release.

## ✨ What's New in v1.2.0

### 🆕 Auto-Lock Timer
- ⏱️ **Configure auto-lock delay** - Choose how long the app stays unlocked when sent to background:
  - Immediately - Lock as soon as you leave the app
  - 30 seconds - Quick check another app without re-entering PIN
  - **1 minute (default)** - Balance between security and convenience
  - 5 minutes - For extended multitasking sessions
- 🎯 **Smart locking** - No more annoying re-authentication when you briefly switch apps
- 💾 **Persistent setting** - Your preference is saved and applied across app restarts
- 🌐 **Fully localized** - Available in both English and Chinese

### Enhanced PIN Management
- 🔐 **Fixed Change PIN flow** - The "Create New PIN" screen now properly appears after verifying your current PIN
- ❌ **Cancel button added** - You can now cancel during PIN verification when changing or disabling your PIN
- 📝 **Clearer labels** - PIN screens now show exactly what you need to do:
  - "Verify Current PIN" - When changing or disabling PIN
  - "Create New PIN" - When setting a new PIN
  - "Confirm New PIN" - When confirming your new PIN

### Visual Consistency
- 🎨 **Device Mode colors** - "Internet Connected" button now uses consistent orange theme (icon, border, background, text)
- 🎨 **App Lock colors** - "Enabled" button now uses consistent red theme (icon, border, background, text)
- ✨ **Better visual feedback** - All button states now have matching colors for a more polished look

### Internationalization
- 🌐 **Complete Chinese translations** - All App Lock and Auto-Lock Timer settings now available in Chinese
- 🌍 **Consistent localization** - Both main settings menu and detail screens fully translated

### Bug Fixes
- ✅ **No more fingerprint button flash** - Fixed brief appearance of fingerprint button during PIN change
- ✅ **Cleaner disable flow** - PIN screen now properly closes before showing the disable confirmation dialog
- 🧹 **Code cleanup** - Removed debug logging for better performance

## 🔐 Security Standards (Unchanged)

This release maintains the same military-grade encryption standards:

- **Encryption**: AES-256-CBC (NIST FIPS 197 approved)
- **Key Derivation**: PBKDF2-HMAC-SHA256 (10,000 iterations)
- **Salt**: 16-byte cryptographically secure random
- **Cross-Platform**: Identical security on mobile and desktop
- **No Data Collection**: All encryption happens locally

## 📱 Platform Support

### Mobile (React Native/Expo)
- ✅ Android
- ✅ iOS
- ✅ QR code generation and scanning
- ✅ Mnemonic phrase validation
- ✅ Password strength checker
- ✅ PIN & Fingerprint authentication

### Desktop (Python CLI)
- ✅ Windows, macOS, Linux
- ✅ Interactive command-line interface
- ✅ Password masking
- ✅ Compatible with mobile encryption

## 🚀 Installation

### Mobile

**Option 1: Build from source**
```bash
cd mobile
npm install
npx expo start
```

**Option 2: Download APK**
- [Download MnemonicEncryption-v1.2.0.apk](https://github.com/BWRabbit1024/mnemonic-encryption/releases) from Releases

### Desktop

```bash
cd desktop
pip install -r requirements.txt
python main.py
```

## 📝 Full Changelog

### Added
- **Auto-Lock Timer feature** with configurable timeout options (Immediately, 30s, 1 minute, 5 minutes)
- Auto-Lock Timer setting persistence via SecureStore
- Timestamp-based background/foreground tracking for smart app locking
- Complete Chinese translations for App Lock and Auto-Lock Timer settings
- Cancel button to PIN verification screens during Change PIN and Disable App Lock operations
- Improved PIN screen labels for better user guidance

### Changed
- Enhanced color consistency in Device Mode settings (Internet Connected button - orange theme)
- Enhanced color consistency in App Lock settings (Enabled button - red theme)
- Improved PIN screen labels: "Verify Current PIN", "Create New PIN", "Confirm New PIN"
- Auto-Lock Timer UI conditionally displays only when App Lock is enabled
- All App Lock related text now uses localization system

### Fixed
- Change PIN flow now correctly shows "Create New PIN" screen after verifying old PIN
- Fingerprint button no longer flashes during PIN change transition
- Disable PIN dialog flow - PIN screen now closes before showing confirmation dialog
- Removed conflicting immediate-lock code that prevented timeout-based locking
- Removed debug console.log statements (code cleanup)

## 🔄 Upgrade from v1.1.1

Simply install the new APK - your existing PIN and settings will be preserved. All encrypted data remains compatible.

## 🙏 Acknowledgments

- Original concept by 张莹 (Zhang Ying) - 2021
- Major security enhancements and cross-platform support - 2024-2025
- Open source community for feedback and support

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

**Remember**: This tool should be part of a comprehensive security strategy. Always use hardware wallets for primary storage of high-value assets.

---

**Repository**: https://github.com/BWRabbit1024/mnemonic-encryption

**Issues**: https://github.com/BWRabbit1024/mnemonic-encryption/issues

**Discussions**: https://github.com/BWRabbit1024/mnemonic-encryption/discussions

🔐 Trust through transparency - your crypto security matters.
