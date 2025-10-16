# 🔐 Secure Mnemonic Encryption Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Desktop-green.svg)]()
[![Security](https://img.shields.io/badge/Security-AES--256--CBC-red.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A professional-grade, **open source** cross-platform tool for securely encrypting cryptocurrency mnemonic phrases using modern cryptographic standards. Available as both a mobile app and desktop application with full compatibility between platforms.

> **🔓 Open Source for Trust**: This is a security tool handling cryptocurrency assets. The source code is open for community audit and verification.

## 📱 Platforms Supported

- **📱 Mobile**: React Native app with Expo (Android/iOS)
- **💻 Desktop**: Python CLI application
- **🔄 Cross-Platform**: Encrypt on mobile, decrypt on desktop (and vice versa)

## ✨ Key Features

### 🔐 **Military-Grade Security**
- **AES-256-CBC encryption** (NIST FIPS 197 approved)
- **PBKDF2 key derivation** (RFC 2898) with SHA-256
- **10,000 iterations** (mobile-optimized while maintaining security)
- **Cryptographically secure random salts** (16 bytes)
- **Cross-platform compatibility** with identical security standards

### 📱 **Mobile App Features**
- **Professional UI** with loading states and haptic feedback
- **QR code generation** for encrypted text sharing
- **QR code scanner** for importing encrypted text
- **Password strength checker** with detailed analysis
- **Clipboard integration** with one-tap copy
- **Security information screen** with full technical specifications
- **No data storage** - all encryption happens locally

### 💻 **Desktop Features**
- **Command-line interface** with password masking
- **Cross-platform decryption** of mobile-generated ciphertext
- **Display-only mode** - no file creation for security
- **Same encryption standards** as mobile version

## 🛡️ Security Standards & Specifications

### **Encryption Algorithm**
- **Standard**: AES-256-CBC (Advanced Encryption Standard)
- **Approval**: NIST FIPS 197 approved
- **Key Length**: 256-bit (military-grade)
- **Block Size**: 128-bit CBC mode

### **Key Derivation**
- **Function**: PBKDF2 (Password-Based Key Derivation Function 2)
- **Standard**: IETF RFC 2898
- **Hash Algorithm**: SHA-256
- **Iterations**: 10,000 (mobile-optimized)

### **Security Features**
- **Salt Generation**: Cryptographically secure random (16 bytes)
- **Padding Scheme**: PKCS#7 (RFC 3852)
- **Encoding**: Base64 (RFC 4648)
- **Data Storage**: No sensitive data stored on device
- **Cross-Platform**: Identical encryption format across platforms

## 🚀 Quick Start

### 📱 Mobile App (React Native)

1. **Install Dependencies:**
   ```bash
   cd react-native-version
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npx expo start
   ```

3. **Run on Device:**
   - Install Expo Go app on your phone
   - Scan QR code from terminal
   - Or run on simulator: `npx expo start --ios` or `npx expo start --android`

### 💻 Desktop (Python)

1. **Install Python 3.8+**

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Application:**
   ```bash
   python src/cli/main.py
   ```

## 📖 Usage Guide

### 🔐 Encryption Workflow

1. **Mobile**: Enter mnemonic → Create strong password → Encrypt → Generate QR code
2. **Share**: Copy encrypted text or scan QR code
3. **Decrypt**: On any platform using the same password

### 📱 Mobile App Navigation

```
🏠 Home Screen
├── 🔒 Encrypt Mnemonic    → Enter phrase and password
├── 🔓 Decrypt Mnemonic    → Paste/scan encrypted text
├── 💪 Password Strength   → Test password security
└── 🛡️ Security Information → View encryption standards
```

### 💻 Desktop Commands

```bash
# Interactive mode (recommended)
python src/cli/main.py

# Direct encryption
python src/cli/main.py --encrypt

# Direct decryption
python src/cli/main.py --decrypt
```

## 🏗️ Project Structure

```
secure-mnemonic-encryption/
├── 📱 react-native-version/          # Mobile app
│   ├── App.js                        # Main React Native app
│   ├── crypto/
│   │   └── SecureEncryption.js       # Mobile encryption logic
│   ├── package.json                  # Mobile dependencies
│   └── app.json                      # Expo configuration
├── 💻 src/                           # Desktop app
│   ├── crypto/
│   │   └── secure_encryption.py     # Desktop encryption (CryptoJS compatible)
│   ├── cli/
│   │   └── main.py                   # Desktop CLI interface
│   └── utils/
├── 📋 requirements.txt               # Python dependencies
└── 📖 README.md                      # This file
```

## 🔒 Password Security Guidelines

### **Minimum Requirements:**
- ✅ **8+ characters** (required)
- ✅ **12+ characters** (recommended)
- ✅ **Mix of character types** (upper, lower, numbers, symbols)
- ✅ **High entropy** (70+ bits for maximum security)

### **Examples:**
- ❌ **Weak**: `password123`, `myname1990`
- ✅ **Good**: `Mountain$River$Eagle$2024!`
- 🚀 **Excellent**: `Kp9$mN2&vQ8#xR5@wE7!zT3%`

## 📊 Security Comparison

| Feature | Original AES_V1.2.py | Current Version |
|---------|---------------------|-----------------|
| Encryption | ❌ Insecure (key=IV) | ✅ AES-256-CBC |
| Key Derivation | ❌ None | ✅ PBKDF2 (10K iterations) |
| Salt | ❌ None | ✅ Random 16-byte salt |
| Padding | ❌ Null bytes | ✅ PKCS#7 standard |
| Platform | ❌ Desktop only | ✅ Mobile + Desktop |
| Cross-Platform | ❌ None | ✅ Full compatibility |
| Standards | ❌ Custom | ✅ NIST/IETF approved |

## 🚀 Building for Production

### 📱 Android APK

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### 📦 Desktop Distribution

```bash
# Create standalone executable (optional)
pip install pyinstaller
pyinstaller --onefile src/cli/main.py
```

## 🔄 Cross-Platform Compatibility

✅ **Encrypt on mobile** → **Decrypt on desktop**
✅ **Encrypt on desktop** → **Decrypt on mobile**
✅ **QR code transfer** between platforms
✅ **Identical security standards** across platforms

## ⚠️ Security Best Practices

### **For High-Value Mnemonics:**
1. **Use hardware wallets** (Ledger, Trezor) as primary storage
2. **This tool is for backup/transport** - not primary storage
3. **Test decryption** before trusting encrypted backups
4. **Use strong, unique passwords** (20+ characters)
5. **Keep password and encrypted text separate**

### **Storage Recommendations:**
- Store encrypted text in multiple secure locations
- Never store password with encrypted data
- Use QR codes for air-gapped transfer
- Test recovery process regularly

## 🤝 Contributing

We welcome contributions! This project prioritizes security above all else.

**Before contributing, please read:**
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

Any contributions must:
- ✅ Maintain or improve current security standards
- ✅ Include comprehensive testing
- ✅ Follow cryptographic best practices
- ✅ Maintain cross-platform compatibility
- ✅ Preserve encryption format backward compatibility

**Found a security issue?** Please report it privately - see [SECURITY.md](SECURITY.md).

## 📄 License

Enhanced from original work by 张莹 (2021). Major security improvements, mobile app, and cross-platform compatibility added.

## 🚨 Important Security Notes

- **🚫 Never use the old AES_V1.2.py** - it has critical security vulnerabilities
- **✅ This tool uses bank/government-grade encryption** standards
- **🔐 All encryption happens locally** - no data sent to servers
- **🏆 Cross-platform compatibility** maintains identical security
- **⚡ 10,000 PBKDF2 iterations** balance security and mobile performance

---

**Remember**: Your cryptocurrency security is only as strong as your weakest link. Use multiple security layers, test your backups, and always prioritize hardware wallets for primary storage.

## 📞 Support

For security questions or bug reports, please review the Security Information screen in the mobile app for complete technical specifications.

**🔐 Trust through transparency - your crypto security matters.**