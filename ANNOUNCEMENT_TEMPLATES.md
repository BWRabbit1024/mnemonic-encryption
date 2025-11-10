# Announcement Templates for Open Source Release

Use these templates to announce your open source release on various platforms.

## 🐦 Twitter/X

### Short Version (280 chars)
```
🔓 Just open sourced my cryptocurrency mnemonic encryption tool!

✅ Cross-platform (Mobile + Desktop)
✅ AES-256-CBC encryption
✅ Full transparency for security
✅ MIT License

Built with React Native & Python. Contributions welcome!

https://github.com/BWRabbit1024/mnemonic-encryption

#crypto #opensource #security
```

### Long Version (Thread)
```
🧵 1/5

🔓 Excited to announce: I'm open sourcing my cryptocurrency mnemonic encryption tool!

For a security tool handling crypto assets, transparency = trust. The community can now verify every line of code.

🔗 https://github.com/BWRabbit1024/mnemonic-encryption

---

2/5

🔐 Security Standards:
• AES-256-CBC (military-grade)
• PBKDF2 with 10K iterations
• No data collection
• Cross-platform compatible

Everything happens locally on your device. No servers, no tracking, no backdoors.

---

3/5

📱 Platform Support:
• Mobile: React Native (Android/iOS)
• Desktop: Python CLI (Win/Mac/Linux)

Encrypt on your phone, decrypt on desktop. Or vice versa. Full compatibility.

---

4/5

Why open source?

In crypto, "don't trust, verify" is the way. By making this tool open source:
✅ Security researchers can audit
✅ Community can contribute
✅ Users can inspect the code
✅ No hidden backdoors

---

5/5

🤝 Looking for contributors!

Whether you're into:
• Security auditing
• React Native development
• Python development
• Documentation

All contributions welcome!

Check out: https://github.com/BWRabbit1024/mnemonic-encryption

#cryptocurrency #blockchain #infosec
```

## 📱 Reddit

### r/cryptocurrency
```markdown
**Title:** [Open Source] Cross-platform tool for encrypting cryptocurrency seed phrases (AES-256-CBC)

**Body:**

Hey r/cryptocurrency,

I've open sourced my tool for encrypting crypto mnemonic phrases. It's designed for those who want to back up their seed phrases securely while keeping them accessible.

## Why Open Source?

For a security tool, transparency is everything. The code is now public so the community can:
- ✅ Verify the encryption implementation
- ✅ Audit for security issues
- ✅ Contribute improvements
- ✅ Trust that there are no backdoors

## Key Features

**Security:**
- AES-256-CBC encryption (NIST FIPS 197)
- PBKDF2 key derivation (10,000 iterations)
- All encryption happens locally
- No data collection or network transmission

**Platform Support:**
- Mobile: React Native (Android/iOS)
- Desktop: Python CLI (Windows/macOS/Linux)
- Full cross-platform compatibility

**Use Case:**
Encrypt your seed phrase with a strong password → Store encrypted text safely → Decrypt when needed on any platform

## Important Security Notes

⚠️ **This is NOT a replacement for hardware wallets!**

This tool is for:
- Backing up existing mnemonics
- Transferring mnemonics between devices securely
- Part of a comprehensive security strategy

Always use hardware wallets (Ledger, Trezor) for primary storage of high-value assets.

## Links

- **GitHub**: https://github.com/BWRabbit1024/mnemonic-encryption
- **License**: MIT
- **Contributing**: See CONTRIBUTING.md

Feedback and contributions welcome! Let me know if you find any security issues (privately via GitHub Security Advisories please).

---

*Disclaimer: Use at your own risk. Always test decryption before relying on encrypted backups.*
```

### r/opensource
```markdown
**Title:** [Released] Secure Mnemonic Encryption - Cross-platform crypto seed phrase encryption (React Native + Python)

**Body:**

Just released my cryptocurrency mnemonic encryption tool as open source!

## Project Overview

A cross-platform tool for encrypting cryptocurrency seed phrases using military-grade encryption standards. Built with React Native (mobile) and Python (desktop).

**Repository**: https://github.com/BWRabbit1024/mnemonic-encryption

## Technology Stack

**Mobile:**
- React Native with Expo
- CryptoJS for encryption
- QR code support for airgapped transfers

**Desktop:**
- Python 3.8+
- cryptography library with CryptoJS compatibility
- Interactive CLI

## Security Standards

- AES-256-CBC encryption
- PBKDF2-HMAC-SHA256 (10,000 iterations)
- Cryptographically secure random salts
- All operations happen locally (no network calls)

## Why This is Interesting

The challenge was maintaining **identical encryption format** across JavaScript (CryptoJS) and Python (cryptography library). Had to implement a CryptoJS-compatible encryption layer in Python to ensure cross-platform compatibility.

## Contributing

Looking for contributors interested in:
- Security auditing
- Cross-platform encryption
- React Native development
- Python development
- Documentation improvements

Check out [CONTRIBUTING.md](https://github.com/BWRabbit1024/mnemonic-encryption/blob/main/CONTRIBUTING.md) for guidelines.

## License

MIT License - Free to use, modify, and distribute.

---

Feedback and contributions welcome!
```

### r/reactnative
```markdown
**Title:** [Open Source] React Native cryptocurrency encryption app with Python cross-compatibility

**Body:**

Built a React Native app for encrypting cryptocurrency seed phrases, now open sourced!

## Tech Highlights

**React Native/Expo:**
- CryptoJS for client-side encryption
- QR code generation/scanning
- Password strength checker
- Secure local storage (nothing persisted)
- Cross-platform (Android/iOS)

**Interesting Challenge:**

Making encryption format compatible between React Native (CryptoJS) and Python backend. The encrypted data can be created on mobile and decrypted on desktop Python CLI, and vice versa.

**Repository**: https://github.com/BWRabbit1024/mnemonic-encryption

## Key Features

- ✅ AES-256-CBC encryption
- ✅ No data collection
- ✅ All crypto happens on-device
- ✅ QR codes for airgapped transfers
- ✅ Premium features with one-time IAP

## Stack

- Expo SDK 54
- React Native 0.81.4
- crypto-js for encryption
- expo-camera for QR scanning
- react-native-qrcode-svg

Contributions welcome! Especially interested in UI/UX improvements.
```

## 💼 LinkedIn

```markdown
🔓 Excited to announce: I'm open sourcing my cryptocurrency security project!

After months of development, I'm making my cross-platform mnemonic encryption tool publicly available. This project demonstrates the intersection of mobile development, cryptography, and security best practices.

🔐 Technical Highlights:

• Cross-platform encryption (React Native + Python)
• AES-256-CBC with PBKDF2 key derivation
• CryptoJS compatibility layer for cross-platform support
• 10,000 PBKDF2 iterations (mobile-optimized)
• Zero data collection - all operations local

📱 Platform Support:

• Mobile: React Native with Expo (Android/iOS)
• Desktop: Python CLI (cross-platform)
• Full bidirectional encryption compatibility

Why open source? For security tools, transparency builds trust. The crypto community values "don't trust, verify" - and open source makes that possible.

Looking forward to contributions from the security and developer communities!

🔗 https://github.com/BWRabbit1024/mnemonic-encryption

#OpenSource #Cryptocurrency #Security #ReactNative #Python #Cryptography #MobileDevelopment
```

## 📧 Dev.to / Hashnode Blog Post

```markdown
**Title:** Building and Open Sourcing a Cross-Platform Cryptocurrency Encryption Tool

---

# Building and Open Sourcing a Cross-Platform Cryptocurrency Encryption Tool

I recently open sourced my cryptocurrency mnemonic encryption tool, and I wanted to share the journey, technical challenges, and why transparency matters for security tools.

## The Problem

Cryptocurrency users need secure ways to backup their seed phrases. Hardware wallets are great for primary storage, but what about backups? What if you need to transfer a mnemonic between devices securely?

## The Solution

A cross-platform encryption tool that:
- Works on mobile (Android/iOS) and desktop (Windows/Mac/Linux)
- Uses military-grade encryption
- Maintains identical encryption format across platforms
- Does everything locally (no servers)

**Repository**: https://github.com/BWRabbit1024/mnemonic-encryption

## Technical Architecture

### Mobile: React Native + CryptoJS

```javascript
// Simplified encryption flow
const salt = CryptoJS.lib.WordArray.random(16);
const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256
});
const encrypted = CryptoJS.AES.encrypt(mnemonic, key.toString());
```

### Desktop: Python + cryptography

The challenge: Make Python's `cryptography` library output the same format as CryptoJS.

```python
class CryptoJSAES:
    """Python implementation of CryptoJS format"""

    @staticmethod
    def encrypt(plaintext: str, password: str) -> str:
        salt = os.urandom(8)
        key, iv = derive_key_and_iv(password, salt)
        # Encrypt and format like CryptoJS
        ...
```

## Key Technical Challenges

### 1. Cross-Platform Encryption Format

CryptoJS uses OpenSSL's EVP_BytesToKey for key derivation, which needed to be replicated in Python. After encryption, CryptoJS adds a "Salted__" prefix to the encrypted data.

### 2. Mobile Performance

PBKDF2 with 100,000+ iterations is too slow on mobile. Settled on 10,000 as a balance between security and UX.

### 3. Security Best Practices

- No data collection
- No network calls
- Clear sensitive data from memory
- Password strength validation
- BIP39 mnemonic validation

## Why Open Source?

For security tools handling cryptocurrency, **transparency is not optional**.

Users need to:
- ✅ Verify the encryption implementation
- ✅ Audit for backdoors
- ✅ Trust the tool with high-value assets

Open source enables community security audits and builds trust through transparency.

## Security Standards

- **Encryption**: AES-256-CBC (NIST FIPS 197)
- **Key Derivation**: PBKDF2-HMAC-SHA256
- **Iterations**: 10,000 (mobile-optimized)
- **Salt**: 16-byte cryptographically secure random

## Contributing

Looking for contributors interested in:
- Security auditing
- UI/UX improvements
- Documentation
- Multi-language support

Check out the [Contributing Guidelines](https://github.com/BWRabbit1024/mnemonic-encryption/blob/main/CONTRIBUTING.md).

## Lessons Learned

1. **Security > Features** - Every decision prioritized security
2. **Cross-platform is hard** - Especially for cryptography
3. **Mobile constraints** - Performance matters (10K iterations vs 100K)
4. **Documentation matters** - Security tools need excellent docs
5. **Open source builds trust** - Especially for security

## Try It Out

**Mobile**: Clone and run with Expo
**Desktop**: `pip install -r requirements.txt && python main.py`

Repository: https://github.com/BWRabbit1024/mnemonic-encryption

---

**Disclaimer**: This tool should be part of a comprehensive security strategy. Always use hardware wallets for primary storage of high-value assets.
```

## 🎯 Product Hunt

```markdown
**Tagline:** Open source cross-platform cryptocurrency mnemonic encryption

**Description:**

Secure Mnemonic Encryption is an open source tool for encrypting cryptocurrency seed phrases with military-grade security. Built with React Native (mobile) and Python (desktop) with full cross-platform compatibility.

**Why we made this:**
For security tools handling cryptocurrency, transparency isn't optional - it's essential. By open sourcing our code, users can verify security, audit for vulnerabilities, and trust the implementation.

**Key Features:**
• AES-256-CBC encryption (military-grade)
• PBKDF2 key derivation (10,000 iterations)
• Cross-platform: Encrypt on mobile, decrypt on desktop
• QR code support for airgapped transfers
• No data collection - everything happens locally
• MIT License - fully open source

**Tech Stack:**
Mobile: React Native, Expo, CryptoJS
Desktop: Python, cryptography library
Platform: Android, iOS, Windows, macOS, Linux

**For who:**
• Cryptocurrency users needing secure backups
• Security-conscious developers
• Anyone wanting transparent encryption

**Not a replacement for:** Hardware wallets remain the best primary storage. This tool is for backups and secure transfers.

**Links:**
GitHub: https://github.com/BWRabbit1024/mnemonic-encryption
License: MIT (Open Source)
```

---

## 📝 Usage Instructions

1. **Choose your platforms** based on where your audience is
2. **Customize the links** to match your actual GitHub repository URL
3. **Add screenshots** or demo videos to increase engagement
4. **Respond to comments** promptly, especially security questions
5. **Cross-link** between platforms (e.g., Reddit post to GitHub, Twitter to blog post)

## ⚠️ Important Notes

- **Security questions**: Always respond professionally and acknowledge valid concerns
- **Private vulnerability reports**: Encourage users to use GitHub Security Advisories
- **Set expectations**: This is v1.1.1 - be open about areas needing improvement
- **Community building**: Engage with early contributors to build momentum

Good luck with your open source release! 🚀
