# Secure Mnemonic Encryption - React Native Mobile App

A professional React Native mobile application for securely encrypting cryptocurrency mnemonic phrases, ready for Google Play Store deployment.

## 🏗️ **BUILD COMMANDS** (START HERE!)

### For Development (with hot reload)
```batch
build-dev.bat
```

### For Release (PRODUCTION - AUTO VERSION BUMP)
```batch
build-release.bat
```

**⚠️ IMPORTANT**: Always use `build-release.bat` for production builds!
- ✅ Automatically increments version number
- ✅ Builds optimized release APK
- ✅ Names APK with version: `MnemonicEncryption-v1.1.x.apk`
- ✅ See [BUILD.md](BUILD.md) for complete documentation

**For AI Assistants**: When asked to build a release, run `build-release.bat`. Never manually bump version.

## 🔒 Security Features

### Encryption Specifications

| Security Aspect | Implementation | Status |
|-----------------|----------------|--------|
| **Key Derivation** | PBKDF2 with SHA-256 | ✅ Secure |
| **Iterations** | 10,000 | ✅ Mobile-optimized |
| **Salt** | 16-byte cryptographically random | ✅ Secure |
| **Encryption** | AES-256-CBC | ✅ Military-grade |
| **Padding** | PKCS#7 (RFC 3852) | ✅ Standard |
| **Encoding** | Base64 (RFC 4648) | ✅ Standard |
| **MD5 Usage** | None | ✅ Clean |

### Security Standards Compliance

- **AES-256-CBC**: NIST FIPS 197 approved
- **PBKDF2**: IETF RFC 2898 compliant
- **SHA-256**: NIST FIPS 180-4 hash algorithm
- **Random Salt**: Each encryption uses unique 16-byte salt
- **Password Validation**: Built-in strength checking with entropy calculation
- **No Data Storage**: All operations happen locally, nothing saved on device
- **Offline Operation**: No internet connection required or used

## 📱 Mobile Features

- **Touch-Friendly Interface**: Optimized for mobile use
- **Copy/Paste Support**: Easy encrypted text handling
- **Haptic Feedback**: Tactile confirmation for actions
- **Secure Input**: Masked password entry
- **Screen Clearing**: Automatic sensitive data clearing

## 🚀 Getting Started

### Prerequisites
```bash
npm install -g @expo/cli
npm install -g eas-cli
```

### Installation
```bash
# Clone and install
cd react-native-version
npm install

# Start development server
expo start
```

### Testing
```bash
# Test on device/emulator
expo start --android
expo start --ios
```

## 📦 Building for Production

### 1. Configure EAS Build
```bash
eas login
eas build:configure
```

### 2. Build APK for Testing
```bash
eas build --platform android --profile preview
```

### 3. Build AAB for Play Store
```bash
eas build --platform android --profile production
```

### 4. Submit to Play Store
```bash
eas submit --platform android
```

## 🏪 Google Play Store Setup

### 1. Create Play Console Account
- Visit [Google Play Console](https://play.google.com/console)
- Pay $25 registration fee
- Complete developer profile

### 2. Create App
- Click "Create app"
- Fill app details:
  - **Name**: Secure Mnemonic Encryption
  - **Category**: Tools
  - **Content rating**: Everyone

### 3. Upload App Bundle
- Go to "Production" → "Create new release"
- Upload your `.aab` file from EAS build
- Fill release notes

### 4. App Content
- **Privacy Policy**: Required (create simple policy)
- **App Category**: Tools
- **Content Rating**: Complete questionnaire
- **Target Audience**: Adults (18+)

## 📋 App Store Listing

### Title
"Secure Mnemonic Encryption - Crypto Wallet Security"

### Short Description
"Encrypt your cryptocurrency seed phrases with military-grade security. No data stored, fully offline encryption tool."

### Full Description
```
Secure Mnemonic Encryption is a professional tool for protecting your cryptocurrency wallet seed phrases with bank-level security.

🔒 SECURITY FEATURES:
• Military-grade AES-256-CBC encryption
• PBKDF2 key derivation with SHA-256 (10,000 iterations)
• Cryptographically secure random salt generation (16 bytes)
• No data storage - everything happens locally

📱 MOBILE OPTIMIZED:
• Touch-friendly interface designed for mobile
• Copy/paste support for easy encrypted text handling
• Haptic feedback for action confirmation
• Automatic screen clearing for security

💰 CRYPTO WALLET PROTECTION:
• Secure your 12-24 word seed phrases
• Perfect for hardware wallet backups
• Compatible with all BIP39 mnemonic formats
• Professional-grade encryption used by banks

🛡️ PRIVACY FIRST:
• No internet connection required
• No data collection or analytics
• No ads or tracking
• Open source encryption algorithms

Perfect for cryptocurrency enthusiasts, hardware wallet users, and anyone serious about protecting their digital assets.

Your security is our priority.
```

### Keywords
"cryptocurrency, bitcoin, wallet, security, encryption, mnemonic, seed phrase, crypto, blockchain, privacy, offline"

### Screenshots Needed
1. **Home Screen**: Main menu with options
2. **Encrypt Screen**: Mnemonic input and encryption
3. **Decrypt Screen**: Encrypted text input and decryption
4. **Password Strength**: Password testing interface
5. **Results Screen**: Encrypted/decrypted output

## 🔧 App Configuration

### Privacy Policy (Required)
Create a simple privacy policy at [privacypolicytemplate.net](https://privacypolicytemplate.net) with:
- No data collection
- No third-party services
- Local processing only
- No advertising

### Content Rating
- **Violence**: None
- **Sexual Content**: None
- **Profanity**: None
- **Controlled Substances**: None
- **Gambling**: None
- **User-Generated Content**: None

## 📊 Expected Timeline

- **Development**: ✅ Complete
- **Testing**: 1 day
- **Play Console Setup**: 1 day
- **App Submission**: 1 day
- **Google Review**: 1-3 days
- **Publication**: Same day after approval

**Total Time to Play Store**: 3-6 days

## 🎯 Success Tips

1. **Professional Screenshots**: Use device frames and clean UI
2. **Clear Description**: Focus on security and crypto use case
3. **Privacy Policy**: Essential for approval
4. **App Icon**: Professional-looking shield/lock icon
5. **No Controversial Content**: Keep descriptions factual

## 🔐 Security Notes

This app provides bank-grade security optimized for mobile devices:
- **Encryption**: AES-256-CBC (NIST FIPS 197 approved)
- **Key Derivation**: PBKDF2 with SHA-256 (10,000 iterations)
- **Salt Generation**: Cryptographically secure random (16 bytes)
- **Cross-Platform**: Compatible with desktop version for encryption/decryption
- **Standards Compliant**: Follows IETF RFC 2898 and NIST specifications

## 📱 Supported Platforms

- **Android**: 7.0+ (API level 24+)
- **iOS**: 11.0+ (if you decide to publish on App Store)
- **Web**: PWA compatible for testing

## 🆘 Support

For Google Play Store submission help:
1. Follow the step-by-step guide above
2. Use EAS Build for reliable APK/AAB generation
3. Test thoroughly before submission
4. Ensure privacy policy is accessible via URL

Your secure mnemonic encryption tool is now ready for the Google Play Store! 🚀