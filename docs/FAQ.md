# Frequently Asked Questions (FAQ)

## General Questions

### What is this tool for?

This tool securely encrypts cryptocurrency mnemonic phrases (seed phrases) using military-grade AES-256 encryption. It's designed for safely backing up and transporting your wallet recovery phrases.

### Is it safe to use?

Yes, when used properly:
- ✅ Uses bank/government-grade AES-256-CBC encryption
- ✅ Industry-standard PBKDF2 key derivation
- ✅ No data sent to servers (fully offline)
- ✅ Open source and auditable

**However**, security depends on:
- 🔑 Your password strength
- 🔐 Your device security
- 🛡️ Your operational security practices

### Can I trust this for my crypto wallet?

This tool should be used as **part of a security strategy**, not as your only protection:

1. **Primary storage**: Use hardware wallets (Ledger, Trezor)
2. **Backup**: Use this tool to encrypt paper backups
3. **Transport**: Safely move mnemonics between devices
4. **Testing**: Always test decryption before trusting backups

### What makes this better than just writing down my seed phrase?

| Method | Security | Portability | Risk |
|--------|----------|-------------|------|
| Paper only | ❌ Readable by anyone | 📄 Physical only | Fire, water, theft |
| This tool | ✅ Encrypted (password required) | 📱 Digital, QR codes | Password loss |
| Hardware wallet | 🏆 Best | ❌ Device-specific | Device failure |

**Best practice**: Use all three together!

## Technical Questions

### What encryption algorithm is used?

- **Algorithm**: AES-256-CBC (Advanced Encryption Standard)
- **Key derivation**: PBKDF2 with SHA-256
- **Iterations**: 10,000 (mobile-optimized)
- **Salt**: 16-byte cryptographically random
- **Padding**: PKCS#7 standard
- **Encoding**: Base64

See [ARCHITECTURE.md](ARCHITECTURE.md) for complete specifications.

### Why 10,000 iterations instead of 100,000?

**Balance between security and usability:**

| Iterations | Security | Mobile Performance |
|------------|----------|-------------------|
| 1,000 | ❌ Too weak | ⚡ Fast |
| 10,000 | ✅ Secure | ✅ ~500ms |
| 100,000 | 🔐 More secure | ❌ ~5 seconds |
| 1,000,000 | 🔐 Very secure | ❌ ~50 seconds |

With a **strong password** (20+ chars), 10,000 iterations provides excellent security while keeping mobile apps responsive.

### Can data encrypted on mobile be decrypted on desktop?

**Yes!** Full cross-platform compatibility:

- ✅ Encrypt on Android → Decrypt on Windows/Mac/Linux
- ✅ Encrypt on Python CLI → Decrypt on mobile
- ✅ Transfer via QR code or copy/paste
- ✅ Identical encryption format

### Is this compatible with other encryption tools?

**Partially**. The tool uses standard algorithms (AES-256-CBC, PBKDF2), so technically any tool implementing the same standards could decrypt the data.

However:
- Format is optimized for this tool
- No guaranteed compatibility with other tools
- Best to decrypt/re-encrypt when migrating

## Usage Questions

### How do I create a strong password?

**Guidelines:**
- ✅ **Minimum**: 12 characters
- ✅ **Recommended**: 20+ characters
- ✅ **Mix**: Uppercase, lowercase, numbers, symbols
- ✅ **Entropy**: 70+ bits (use password strength checker)

**Examples:**
```
❌ Weak:     password123
❌ Weak:     JohnSmith1990
⚠️  Okay:    MyD0g&MyCat!2024
✅ Good:     Correct-Horse-Battery-Staple-2024!
🏆 Excellent: Kp9$mN2&vQ8#xR5@wE7!zT3%aL6^
```

**Pro tip**: Use a passphrase with 4-5 random words + numbers + symbols

### What if I forget my password?

**There is NO password recovery.** This is by design for security.

**If you lose your password:**
- ❌ Encrypted data is permanently unrecoverable
- ❌ No backdoor or master key exists
- ❌ Even we (developers) cannot help

**Prevention:**
1. Use a password manager (1Password, Bitwarden)
2. Write password on paper, store separately from encrypted data
3. Test decryption immediately after encrypting
4. Keep multiple backups in secure locations

### How do I backup my encrypted mnemonic?

**Multi-layer backup strategy:**

1. **Primary**: Hardware wallet (Ledger/Trezor)
2. **Backup #1**: Encrypted with this tool → cloud storage
3. **Backup #2**: Encrypted with this tool → USB drive
4. **Backup #3**: Paper backup (encrypted output + password stored separately)

**Storage locations:**
- ✅ Cloud storage (Google Drive, Dropbox) - encrypted data only
- ✅ USB drives in safe/bank vault
- ✅ Password manager for the encryption password
- ❌ NEVER store password with encrypted data

### Can I use this for passwords or other secrets?

**Yes**, but it's optimized for mnemonic phrases:

**Good for:**
- ✅ Cryptocurrency seed phrases (12-24 words)
- ✅ Private keys (hex strings)
- ✅ Short passwords/secrets (<1KB)

**Not ideal for:**
- ❌ Large files (use file encryption tools)
- ❌ Multiple secrets (use password manager)
- ❌ Frequent access (use password manager)

## Platform-Specific Questions

### Android: Why does the app request camera permission?

The camera is used **only** for scanning QR codes of encrypted text. You can:
- ✅ Deny camera permission
- ✅ Still use encrypt/decrypt via copy/paste
- ❌ Won't be able to scan QR codes

### Desktop: Can I use this without Python knowledge?

**Yes!** Just follow these steps:

1. Install Python 3.8+ ([python.org](https://python.org))
2. Open terminal/command prompt
3. Run: `pip install -r requirements.txt`
4. Run: `python desktop/cli/main.py`
5. Follow the interactive menu

No programming needed!

### Can I build a standalone executable?

**Yes**, using PyInstaller:

```bash
pip install pyinstaller
pyinstaller --onefile desktop/cli/main.py
```

Output: `dist/main.exe` (Windows) or `dist/main` (Linux/Mac)

### Does this work on iOS?

**Not yet**, but coming soon! Currently:
- ✅ Android (via Expo/React Native)
- ✅ Desktop (Windows, Mac, Linux)
- ⏳ iOS (planned for v2.1.0)

## Security Questions

### Can this be hacked?

**Depends on the attack:**

| Attack Type | Protection |
|-------------|------------|
| Brute force (weak password) | ❌ Vulnerable if password is weak |
| Brute force (strong password) | ✅ Computationally infeasible |
| Malware/keylogger | ❌ Can steal password as you type |
| Physical device access | ⚠️ Depends on device lock |
| Network interception | ✅ No network communication |
| Quantum computing | ⚠️ Future threat (decades away) |

**Bottom line**: With a strong password and secure device, extremely difficult to break.

### What about quantum computing?

**Current status:**
- ✅ AES-256 is considered quantum-resistant
- ⚠️ PBKDF2 may be vulnerable in distant future
- 🔮 Practical quantum attacks are 20+ years away

**If quantum computing becomes a threat:**
- We'll upgrade to post-quantum algorithms
- You can re-encrypt your data then

### Is my data sent to any server?

**No, never.** This tool is 100% offline:
- ✅ All encryption happens on your device
- ✅ No internet connection required
- ✅ No analytics or tracking
- ✅ No cloud processing
- ✅ Open source - verify yourself!

### Can the developers access my data?

**Absolutely not.** We have:
- ❌ No access to your passwords
- ❌ No access to your encrypted data
- ❌ No backdoors or master keys
- ❌ No way to recover your password

This is true end-to-end encryption.

## Troubleshooting

### Decryption fails with "Wrong password"

**Possible causes:**
1. ❌ Incorrect password (most common)
2. ❌ Corrupted encrypted data
3. ❌ Copy/paste error (missing characters)
4. ❌ Wrong encrypted text

**Solutions:**
1. ✅ Double-check password (case-sensitive!)
2. ✅ Re-copy encrypted text carefully
3. ✅ Try decryption on original device
4. ✅ Check for extra spaces/newlines

### QR code won't scan

**Possible causes:**
1. QR code too large (long ciphertext)
2. Low image quality
3. Poor lighting
4. Camera permission denied

**Solutions:**
1. ✅ Use copy/paste instead
2. ✅ Increase screen brightness
3. ✅ Ensure good lighting
4. ✅ Grant camera permission

### Mobile app is slow

**Normal:**
- ⏱️ Encryption: ~500ms (PBKDF2 iterations)
- ⏱️ Decryption: ~500ms

**If slower than 2 seconds:**
- 📱 Close background apps
- 🔄 Restart app
- 🔄 Restart device
- 📦 Update to latest version

### Desktop: "Module not found" error

```bash
# Solution:
pip install -r desktop/requirements.txt

# Or individually:
pip install pycryptodome
```

## Comparison Questions

### How does this compare to hardware wallets?

| Feature | This Tool | Hardware Wallet |
|---------|-----------|-----------------|
| Security | ✅ Very high | 🏆 Best |
| Cost | ✅ Free | 💰 $50-200 |
| Convenience | ✅ High | ⚠️ Requires device |
| Backup | ✅ Multiple copies | ⚠️ Physical only |
| Primary storage | ❌ Not recommended | ✅ Recommended |
| Transport | ✅ Excellent | ❌ Physical device |

**Recommendation**: Use **both**!
- Hardware wallet for primary storage
- This tool for encrypted backups

### How does this compare to AES_V1.2.py?

**DO NOT USE AES_V1.2.py** - it has critical vulnerabilities!

| Feature | AES_V1.2.py (OLD) | This Tool (v2.0) |
|---------|-------------------|------------------|
| Encryption | ❌ Insecure | ✅ AES-256-CBC |
| Key derivation | ❌ None | ✅ PBKDF2 |
| Salt | ❌ None | ✅ Random 16-byte |
| Padding | ❌ Null bytes | ✅ PKCS#7 |
| Mobile app | ❌ No | ✅ Yes |
| Security | ❌ Vulnerable | ✅ Secure |

**Migration**: Decrypt with v1.2, re-encrypt with v2.0

## Contributing

### Can I contribute to this project?

**Yes!** We welcome contributions:
- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🔐 Security audits

**Requirements:**
- Maintain or improve security standards
- Include tests for new features
- Follow cryptographic best practices

### How do I report a security issue?

**DO NOT** open a public GitHub issue!

Instead:
1. See [SECURITY.md](../SECURITY.md) for reporting process
2. Use GitHub Security Advisories
3. We'll respond within 48 hours

## License & Legal

### What's the license?

**MIT License** - free to use, modify, and distribute.

See [LICENSE](../LICENSE) for full terms.

### Any warranty?

**No warranty** - as-is basis:
- ✅ We've done our best to make it secure
- ❌ We cannot guarantee perfect security
- ❌ Use at your own risk
- ✅ Open source - you can audit it yourself

### Can I use this commercially?

**Yes**, under MIT License:
- ✅ Free for commercial use
- ✅ No licensing fees
- ✅ Must include original license
- ✅ No warranty provided

---

## Still have questions?

1. Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
2. Check [SECURITY.md](../SECURITY.md) for security information
3. Review the source code (it's open!)
4. Open a GitHub issue for feature requests or bugs

**Remember**: For cryptocurrency security, use multiple layers of protection. This tool is one piece of a comprehensive security strategy.
