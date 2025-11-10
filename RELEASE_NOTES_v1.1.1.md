# Release v1.1.1 - Initial Open Source Release

## 🎉 Going Open Source!

We're excited to announce that **Secure Mnemonic Encryption** is now **open source**! This cryptocurrency security tool is available for community audit, contribution, and trust verification.

## 🔓 Why Open Source?

For a tool that handles cryptocurrency assets, **transparency is security**. By open sourcing our code:

- ✅ **Independent security audits** are possible
- ✅ **Community can verify** encryption implementation
- ✅ **No hidden backdoors** - inspect every line of code
- ✅ **"Don't trust, verify"** - the crypto way

## ✨ What's New in v1.1.1

### Security Enhancements
- 🔒 Added auto-clear timer for sensitive data (5 minutes)
- 🛡️ Enhanced security documentation
- 📋 Security-focused contribution guidelines

### Open Source Infrastructure
- 📝 Added CONTRIBUTING.md with security guidelines
- 🤝 Added CODE_OF_CONDUCT.md
- 🐛 GitHub issue templates for bugs and features
- 🔀 Pull request template with security checklist
- 📚 Added CLAUDE.md for developer onboarding
- 🎨 Updated README with badges and contribution info

### Documentation Improvements
- 📖 Comprehensive architecture guide
- 🔐 Security standards clearly documented
- 🔄 Cross-platform compatibility explained
- 💻 Developer setup instructions

## 🔐 Security Standards

This tool uses military-grade encryption:

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

### Desktop (Python CLI)
- ✅ Windows, macOS, Linux
- ✅ Interactive command-line interface
- ✅ Password masking
- ✅ Compatible with mobile encryption

## 🚀 Getting Started

### Mobile Installation

**Option 1: Build from source**
```bash
cd mobile
npm install
npx expo start
```

**Option 2: Download APK**
- [Download from Releases](https://github.com/BWRabbit1024/mnemonic-encryption/releases) (if available)

### Desktop Installation

```bash
cd desktop
pip install -r requirements.txt
python main.py
```

## 🤝 Contributing

We welcome contributions! Please read:

- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

**Found a security issue?** Report it privately via GitHub Security Advisories.

## 📝 Full Changelog

### Added
- Open source documentation and templates
- Auto-clear security timer (5 minutes)
- Developer onboarding guide (CLAUDE.md)
- GitHub community templates
- Open source badges in README

### Changed
- Updated README with contribution information
- Enhanced .gitignore for better security

### Security
- Comprehensive security audit performed
- All sensitive credentials excluded from repository
- Security-focused contribution process established

## 🙏 Acknowledgments

- Original concept by 张莹 (Zhang Ying) - 2021
- Major security enhancements and cross-platform support - 2024-2025
- Open source community for trust and transparency

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

**Remember**: This tool should be part of a comprehensive security strategy. Always use hardware wallets for primary storage of high-value assets.

---

**Repository**: https://github.com/BWRabbit1024/mnemonic-encryption

**Issues**: https://github.com/BWRabbit1024/mnemonic-encryption/issues

**Discussions**: https://github.com/BWRabbit1024/mnemonic-encryption/discussions

🔐 Trust through transparency - your crypto security matters.
