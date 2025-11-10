# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-18

### Added
- ⏱️ **Auto-Lock Timer** - Configure how long the app stays unlocked when sent to background
  - Options: Immediately, 30 seconds, 1 minute (default), 5 minutes
  - Prevents unnecessary re-authentication for brief app switches
  - Setting persists across app restarts
- ➕ Cancel button to PIN verification screens during Change PIN and Disable App Lock operations
- 📱 Improved PIN screen labels for better user guidance
- 🌐 Complete Chinese translations for all App Lock and Auto-Lock Timer settings

### Changed
- 🎨 Enhanced color consistency in Device Mode settings (Internet Connected button now uses orange theme)
- 🎨 Enhanced color consistency in App Lock settings (Enabled button now uses red theme)
- 📝 Improved PIN screen labels: "Verify Current PIN", "Create New PIN", "Confirm New PIN"
- 🔄 Auto-Lock Timer UI only appears when App Lock is enabled

### Fixed
- ✅ Change PIN flow now correctly shows "Create New PIN" screen after verifying old PIN
- ✅ Fingerprint button no longer flashes during PIN change transition
- ✅ Disable PIN dialog flow - PIN screen now closes before showing confirmation dialog
- 🧹 Removed debug console.log statements (code cleanup)

## [1.1.0] - 2025-10-02

### Added
- 📦 Version suffix in APK filename (e.g., `SecureMnemonic-v1.1.0-release-universal.apk`)
- 📚 Comprehensive documentation suite:
  - ARCHITECTURE.md with system diagrams and data flow
  - FAQ.md with 50+ common questions and answers
  - Platform-specific README files for mobile and desktop
- 📄 MIT License with security notice
- 🔒 SECURITY.md with vulnerability reporting guidelines

### Changed
- 🏗️ Restructured project into mobile/ and desktop/ directories (from code/)
- 🔧 Fixed all Python imports (from `src.` structure to direct imports)
- 📝 Updated all documentation to reflect new structure
- 🛠️ Improved build system with automatic versioned APK outputs
- 📋 Enhanced help text with correct command examples

### Fixed
- ✅ ModuleNotFoundError in desktop CLI after restructuring
- ✅ Relative import errors in all __init__.py files
- ✅ sys.path configuration for proper module resolution
- ✅ Help text examples now show correct command syntax (python main.py)

### Removed
- ❌ Obsolete sys.path insertion pointing to old 'src/' directory
- ❌ 96,024 lines of build artifacts and cache files

## [2.0.0] - 2025-10-01

### Added
- 📱 React Native mobile application for Android/iOS
- 🔐 Cross-platform encryption compatibility
- 📊 QR code generation for encrypted text sharing
- 📷 QR code scanner for importing encrypted text
- 💪 Password strength checker with detailed analysis
- 🛡️ Security information screen with technical specs
- 📱 Mobile-optimized UI with haptic feedback
- 🎨 Professional loading states and animations
- 📋 Clipboard integration with one-tap copy
- 🏗️ Improved project structure (mobile/, desktop/, docs/)
- 📄 LICENSE file (MIT License)
- 🔒 SECURITY.md with vulnerability reporting guidelines
- 📚 Comprehensive .gitignore files
- 📖 Enhanced README with architecture documentation

### Changed
- 🔄 Restructured project into mobile/ and desktop/ directories
- 🔐 Optimized PBKDF2 iterations to 10,000 (mobile-friendly)
- 📝 Improved documentation and usage guides
- 🎯 Enhanced cross-platform compatibility

### Security
- ✅ Implemented AES-256-CBC encryption (NIST FIPS 197)
- ✅ Added PBKDF2 key derivation (RFC 2898)
- ✅ Cryptographically secure random salt generation
- ✅ Proper PKCS#7 padding (RFC 3852)
- ✅ Base64 encoding (RFC 4648)
- ✅ No data storage - all operations local

### Removed
- ❌ Deprecated AES_V1.2.py (security vulnerabilities)
- ❌ Old backup files and archives
- ❌ Build artifacts and cache files
- ❌ Unnecessary debug files

## [1.2.0] - 2021-10-03

### Added
- Initial Python implementation (AES_V1.2.py)
- Basic encryption/decryption functionality

### Security Issues (Fixed in 2.0.0)
- ⚠️ Used same key for encryption and IV (critical vulnerability)
- ⚠️ No proper key derivation function
- ⚠️ No salt generation
- ⚠️ Insecure padding with null bytes
- ⚠️ Custom non-standard cryptographic implementation

---

## Migration Guide

### From v1.2.0 to v2.0.0

**⚠️ IMPORTANT**: Data encrypted with AES_V1.2.py **CANNOT** be decrypted with v2.0.0 due to fundamental security improvements.

**Before upgrading:**
1. Decrypt all data encrypted with v1.2.0
2. Re-encrypt using v2.0.0 with a strong password
3. Test decryption on both mobile and desktop
4. Securely delete old encrypted files

**What's Changed:**
- New encryption format (incompatible with v1.2.0)
- Stronger security standards
- Cross-platform support
- Mobile application available

---

## Upcoming Features

### Planned for v2.1.0
- [ ] iOS App Store release
- [ ] Biometric authentication for mobile
- [ ] Multiple encryption profiles
- [ ] Batch encryption/decryption
- [ ] Export/import settings

### Under Consideration
- [ ] Hardware security key support
- [ ] Multi-language support
- [ ] Offline documentation
- [ ] Desktop GUI application
- [ ] Browser extension

---

## Version Support

| Version | Status | Support End Date |
|---------|--------|-----------------|
| 2.0.x   | ✅ Active | TBD |
| 1.2.x   | ⚠️ Deprecated | 2025-10-01 |
| < 1.2   | ❌ Unsupported | 2021-10-03 |

---

For detailed security information, see [SECURITY.md](SECURITY.md)
