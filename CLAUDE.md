# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A cross-platform cryptocurrency mnemonic phrase encryption tool with identical security standards across mobile (React Native/Expo) and desktop (Python) platforms. The project provides military-grade AES-256-CBC encryption with PBKDF2 key derivation.

**Critical Security Note**: This is a defensive security tool for protecting cryptocurrency seed phrases. All encryption happens locally with no network transmission of sensitive data.

## Project Structure

```
05_mnemonic_encryption/
├── mobile/                    # React Native (Expo) mobile app
│   ├── App.js                # Main app entry point with navigation
│   ├── crypto/
│   │   └── SecureEncryption.js    # CryptoJS-based encryption (matches Python)
│   ├── components/           # Reusable React Native components
│   ├── utils/               # BIP39 validation and helpers
│   ├── package.json         # Mobile dependencies
│   ├── app.json            # Expo configuration
│   └── android/            # Native Android build files
│       └── app/build.gradle
├── desktop/                 # Python CLI application
│   ├── main.py             # Entry point
│   ├── cli/
│   │   └── main.py        # Interactive CLI with password masking
│   ├── crypto/
│   │   └── secure_encryption.py    # CryptoJS-compatible encryption
│   └── requirements.txt
└── README.md              # Comprehensive documentation
```

## Common Development Commands

### Mobile Development (React Native/Expo)

```bash
# Install dependencies
cd mobile
npm install

# Start development server
npx expo start

# Run on Android device/emulator
npx expo run:android

# Install APK on specific device (for testing)
"D:\00_Program\Android\SDK_Components_Setup\platform-tools\adb.exe" -s AF2SVB3828001005 install path/to/app.apk

# Uninstall app from device
"D:\00_Program\Android\SDK_Components_Setup\platform-tools\adb.exe" -s AF2SVB3828001005 uninstall com.securemnemonic.encrypt

# Build APK for testing
eas build --platform android --profile preview

# Bump version (updates both package.json and app.json)
npm run bump-version
```

### Desktop Development (Python)

```bash
# Install dependencies
cd desktop
pip install -r requirements.txt

# Run interactive CLI
python main.py

# Direct encryption mode
python main.py --encrypt

# Direct decryption mode
python main.py --decrypt

# Test password strength
python main.py --test-password
```

## Architecture & Critical Implementation Details

### Cross-Platform Encryption Compatibility

**CRITICAL**: The encryption format MUST remain identical between mobile and desktop for cross-platform compatibility.

#### Encryption Flow (Both Platforms)
1. Generate 16-byte random salt using cryptographically secure RNG
2. Derive 256-bit key using PBKDF2-HMAC-SHA256 (10,000 iterations)
3. Convert derived key to hex string
4. Encrypt mnemonic with AES-256-CBC using CryptoJS format
5. Combine: `base64(salt_hex + ':' + cryptojs_encrypted_data)`

#### Format Structure
```
Base64(salt_hex:CryptoJS_encrypted_data)
           ↓
salt_hex:Salted__[8-byte-salt][encrypted-data]
```

**Mobile Implementation** (`mobile/crypto/SecureEncryption.js`):
- Uses `crypto-js` library
- PBKDF2 with 10,000 iterations (mobile-optimized)
- Random salt via `CryptoJS.lib.WordArray.random(16)`

**Desktop Implementation** (`desktop/crypto/secure_encryption.py`):
- Uses `cryptography` library with custom CryptoJS compatibility layer
- Class `CryptoJSAES` implements OpenSSL EVP_BytesToKey for key derivation
- Class `SecureMnemonicEncryption` matches mobile API exactly

### Security Standards

- **Encryption**: AES-256-CBC (NIST FIPS 197)
- **Key Derivation**: PBKDF2-HMAC-SHA256, 10,000 iterations (RFC 2898)
- **Salt**: 16 bytes cryptographically secure random
- **Padding**: PKCS#7
- **No data storage**: All operations in memory only

### Mobile App Architecture

**Navigation Structure**:
- Home screen with card-based navigation
- Encrypt/Decrypt screens with form validation
- Password strength checker with real-time analysis
- Security information screen (educational)
- Settings with language toggle and device mode
- QR code generation/scanning (premium features)

**Key Components**:
- `SecureMnemonicEncryption`: Core crypto operations
- `PasswordStrengthChecker`: Entropy calculation and validation
- `MnemonicScanModal`: QR code scanning with OCR
- `validateMnemonicWords`: BIP39 word validation

**State Management**:
- React hooks (useState, useEffect)
- SecureStore for premium status persistence
- No mnemonic data persisted to storage

### Desktop CLI Architecture

**Interactive Features**:
- Password masking with asterisks (Windows `msvcrt`)
- Password strength validation during input
- Multi-line mnemonic input
- Automatic decryption verification after encryption
- Screen clearing after displaying decrypted data

### Development Constraints

1. **ADB Path**: Pre-configured for Windows development environment at `D:\00_Program\Android\SDK_Components_Setup\platform-tools\adb.exe`

2. **Device ID**: Test device configured as `AF2SVB3828001005`

3. **Version Management**:
   - Mobile: `mobile/package.json` version field (currently 1.1.1)
   - Android versionCode in `mobile/app.json` and `mobile/android/app/build.gradle`
   - Must be synchronized manually or via `bump-version` script

4. **Dependencies**:
   - Mobile: Expo SDK 54, React Native 0.81.4, crypto-js 4.2.0
   - Desktop: Python 3.8+, cryptography 41.0.0+

## Testing Encryption Compatibility

To verify cross-platform compatibility:

1. Encrypt a test mnemonic on mobile
2. Copy encrypted output
3. Decrypt on desktop with same password
4. Verify mnemonic matches exactly

Or vice versa. The encryption format is designed to be bidirectionally compatible.

## Security Development Guidelines

- **Never** log or store unencrypted mnemonics
- **Never** reduce PBKDF2 iterations below 10,000
- **Never** reuse salts or IVs
- **Always** use cryptographically secure random number generators
- **Always** verify decryption immediately after encryption
- Password minimum: 8 characters (12+ recommended)
- Clear sensitive data from memory after use

## Known Limitations

- Desktop CLI password masking is Windows-specific (uses `msvcrt`)
- Premium features (QR code, OCR) require one-time purchase
- RevenueCat integration temporarily disabled due to Expo compatibility issues
- Offline mode required for security-sensitive operations

## Package IDs & App Configuration

- **Android Package**: `com.securemnemonic.encrypt`
- **iOS Bundle ID**: `com.securemnemonic.encrypt`
- **Expo Project ID**: `dc138022-8e57-4f4a-b15b-a858eccef86a`
- **Expo Owner**: `bwrabbit1024`

## Important Files

- `mobile/crypto/SecureEncryption.js` - Core mobile encryption logic
- `desktop/crypto/secure_encryption.py` - Core desktop encryption with CryptoJS compatibility
- `mobile/App.js` - Main mobile application with all screens
- `desktop/cli/main.py` - Desktop CLI interface
- `README.md` - Comprehensive user documentation with security guidelines
