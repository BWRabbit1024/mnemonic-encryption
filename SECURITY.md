# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please follow responsible disclosure practices:

### How to Report

1. **DO NOT** open a public GitHub issue
2. Email: [Create a security advisory on GitHub](https://github.com/BWRabbit1024/Python-Project/security/advisories/new)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2 weeks
  - Low: 1 month

### Security Considerations

#### What This Tool Does
- ✅ Provides AES-256-CBC encryption for text data
- ✅ Uses PBKDF2 key derivation with 10,000 iterations
- ✅ Generates cryptographically secure random salts
- ✅ Implements proper PKCS#7 padding
- ✅ Works offline with no data transmission

#### What This Tool Does NOT Do
- ❌ Store your passwords or encrypted data
- ❌ Provide password recovery
- ❌ Replace hardware wallets for crypto storage
- ❌ Guarantee absolute security (depends on password strength)
- ❌ Protect against keyloggers or compromised devices

### Known Limitations

1. **Password Security**: Security is only as strong as your password
2. **Device Security**: Assumes your device is not compromised
3. **Side-channel Attacks**: No protection against timing attacks or similar
4. **Quantum Computing**: AES-256 is quantum-resistant but PBKDF2 may be vulnerable in the distant future

### Best Practices

#### For Users
1. **Use strong passwords** (20+ characters, high entropy)
2. **Test decryption** before trusting encrypted backups
3. **Store password and encrypted data separately**
4. **Use hardware wallets** for primary crypto storage
5. **Keep software updated** to get security fixes
6. **Don't reuse passwords** from other services

#### For Developers
1. **Never modify core crypto logic** without expert review
2. **Add tests** for any security-related changes
3. **Document changes** that affect encryption/decryption
4. **Follow cryptographic best practices**
5. **Review dependencies** for vulnerabilities

### Cryptographic Standards Compliance

This project follows:
- **AES-256-CBC**: NIST FIPS 197 approved
- **PBKDF2**: IETF RFC 2898
- **SHA-256**: NIST FIPS 180-4
- **PKCS#7 Padding**: RFC 3852
- **Base64 Encoding**: RFC 4648

### Dependencies Security

We regularly monitor dependencies for known vulnerabilities:
- Python: `pip-audit` or `safety`
- JavaScript: `npm audit`

### Out of Scope

The following are considered out of scope for security reports:
- Social engineering attacks
- Physical access to unlocked devices
- Brute force attacks with weak passwords
- Issues in third-party dependencies (report to them directly)
- Theoretical attacks without practical exploitation

### Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities.
Contributors will be acknowledged in release notes (unless they prefer anonymity).

---

**Remember**: This tool encrypts data, but security ultimately depends on:
1. Your password strength
2. Your device security
3. Your operational security practices

Use as part of a comprehensive security strategy, not as a standalone solution.
