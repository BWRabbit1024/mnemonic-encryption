# Contributing to Secure Mnemonic Encryption

Thank you for your interest in contributing! This project prioritizes **security** and **cross-platform compatibility** above all else.

## 🔐 Security-First Development

This is a **defensive security tool** for protecting cryptocurrency assets. All contributions must:

- ✅ Maintain or improve current security standards
- ✅ Preserve cross-platform encryption compatibility
- ✅ Include thorough testing
- ✅ Follow cryptographic best practices
- ❌ Never reduce PBKDF2 iterations below 10,000
- ❌ Never log or store unencrypted mnemonics
- ❌ Never compromise the encryption format compatibility

## 🚨 Security Vulnerabilities

**DO NOT** open public issues for security vulnerabilities. Instead:

1. **Use GitHub Security Advisories** (preferred method)
   - Go to the Security tab → Advisories → "Report a vulnerability"
   - This allows private discussion and coordinated disclosure
   - We'll work with you to verify, fix, and properly credit your discovery

2. **What to include in your report:**
   - Detailed description of the vulnerability
   - Steps to reproduce the issue
   - Potential security impact
   - Any suggested fixes (optional)

3. **Responsible disclosure timeline:**
   - We aim to respond within 48 hours
   - We'll work on a fix and keep you updated
   - Allow 90 days for a patch before public disclosure
   - You'll receive credit in release notes (unless you prefer anonymity)

## 💻 Development Setup

### Mobile (React Native/Expo)

```bash
cd mobile
npm install
npx expo start
```

### Desktop (Python)

```bash
cd desktop
pip install -r requirements.txt
python main.py
```

## 🧪 Testing Encryption Compatibility

**CRITICAL**: Any changes to encryption logic MUST be tested for compatibility:

```bash
# 1. Encrypt on mobile
# 2. Copy encrypted output
# 3. Decrypt on desktop with same password
# 4. Verify mnemonic matches exactly
# 5. Repeat in reverse direction
```

## 📝 Pull Request Process

1. **Fork** the repository
2. **Create a branch** with a descriptive name: `fix/password-validation` or `feature/qr-error-handling`
3. **Make your changes** with clear commit messages
4. **Test thoroughly**:
   - Mobile: Test on both Android and iOS if possible
   - Desktop: Test on Windows/macOS/Linux if possible
   - Cross-platform: Verify encryption compatibility
5. **Update documentation** if needed
6. **Submit PR** with:
   - Clear description of changes
   - Why the change is needed
   - Testing performed
   - Screenshots/videos for UI changes

## 🎯 Good First Issues

Look for issues labeled `good first issue`:
- UI/UX improvements
- Documentation enhancements
- Error message clarity
- Translation additions
- Test coverage

## ⚠️ What We Won't Accept

- Changes that reduce security
- Breaking changes to encryption format without migration path
- Features that require network connectivity for core functionality
- Code that stores unencrypted mnemonics
- Changes that break cross-platform compatibility

## 📖 Code Style

### JavaScript/React Native
- Use ES6+ features
- Functional components with hooks
- Clear variable names
- Comments for complex crypto operations

### Python
- PEP 8 style guide
- Type hints where applicable
- Docstrings for public methods
- Clear error messages

## 🔑 Core Architecture

Read `CLAUDE.md` to understand:
- Cross-platform encryption format
- CryptoJS compatibility layer
- Security standards
- Project structure

## 💬 Questions?

- Open a discussion on GitHub
- Check existing issues and pull requests
- Review the README.md and SECURITY.md

Thank you for helping make cryptocurrency security more accessible! 🔐
