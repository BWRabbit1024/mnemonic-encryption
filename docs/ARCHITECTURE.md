# Architecture Documentation

## System Overview

The Secure Mnemonic Encryption Suite is a cross-platform application consisting of two main components:

1. **Mobile Application** (React Native + Expo)
2. **Desktop Application** (Python CLI)

Both share identical cryptographic implementations to ensure cross-platform compatibility.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
├──────────────────────┬──────────────────────────────────────┤
│   Mobile (React)     │     Desktop (Python CLI)             │
│  - Encrypt Screen    │  - Interactive Menu                  │
│  - Decrypt Screen    │  - Command Line Args                 │
│  - QR Code Gen/Scan  │  - Password Masking                  │
│  - Password Check    │                                      │
└──────────┬───────────┴──────────────────┬───────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────────────────────────────────────────────┐
│              Cryptographic Engine (Identical)                 │
├──────────────────────────────────────────────────────────────┤
│  SecureEncryption.js          secure_encryption.py           │
│  (JavaScript/CryptoJS)        (Python/PyCryptodome)          │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  1. Password → PBKDF2 (SHA-256, 10K iter) → Key    │     │
│  │  2. Generate Random Salt (16 bytes)                │     │
│  │  3. AES-256-CBC Encryption                         │     │
│  │  4. PKCS#7 Padding                                 │     │
│  │  5. Base64 Encoding                                │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Storage Layer                              │
├──────────────────────────────────────────────────────────────┤
│  Mobile: Clipboard, QR Code     Desktop: Terminal Display    │
│  (No persistent storage)         (Display-only mode)         │
└──────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Mobile Application

```
mobile/
├── App.js                    # Main application component
│   ├── HomeScreen           # Navigation hub
│   ├── EncryptScreen        # Mnemonic encryption UI
│   ├── DecryptScreen        # Mnemonic decryption UI
│   ├── PasswordCheckScreen  # Password strength analysis
│   └── SecurityInfoScreen   # Technical specifications
│
├── crypto/
│   └── SecureEncryption.js  # Cryptographic implementation
│       ├── encrypt()        # AES-256-CBC encryption
│       ├── decrypt()        # AES-256-CBC decryption
│       └── checkPasswordStrength()
│
├── android/                 # Native Android configuration
└── package.json            # Dependencies
```

### 2. Desktop Application

```
desktop/
├── cli/
│   └── main.py             # Command-line interface
│       ├── MainMenu        # Interactive menu system
│       └── CLI args        # Direct command support
│
├── crypto/
│   ├── secure_encryption.py    # Core encryption (CryptoJS compatible)
│   │   ├── SecureEncryption class
│   │   ├── encrypt_text()
│   │   └── decrypt_text()
│   │
│   └── cryptojs_compatible.py  # Legacy compatibility
│
├── utils/
│   └── file_manager.py     # File operations (optional)
│
├── tests/
│   └── test_encryption.py  # Unit tests
│
└── requirements.txt        # Python dependencies
```

## Data Flow

### Encryption Flow

```
┌──────────────┐
│ User Input   │
│ - Mnemonic   │
│ - Password   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 1. Password Validation                  │
│    - Length check (8+ chars)            │
│    - Strength analysis (optional)       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 2. Key Derivation                       │
│    PBKDF2(password, salt, 10000, SHA256)│
│    → 256-bit key + 128-bit IV           │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 3. Encryption                           │
│    AES-256-CBC(plaintext, key, IV)      │
│    with PKCS#7 padding                  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 4. Encoding                             │
│    Base64(salt + ciphertext)            │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Output                                  │
│ - Encrypted text (base64)               │
│ - QR code (mobile only)                 │
└─────────────────────────────────────────┘
```

### Decryption Flow

```
┌──────────────┐
│ User Input   │
│ - Ciphertext │
│ - Password   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 1. Decode                               │
│    Base64.decode(ciphertext)            │
│    → salt (16 bytes) + encrypted data   │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 2. Key Derivation                       │
│    PBKDF2(password, salt, 10000, SHA256)│
│    → 256-bit key + 128-bit IV           │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ 3. Decryption                           │
│    AES-256-CBC.decrypt(data, key, IV)   │
│    with PKCS#7 unpadding                │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Output                                  │
│ - Original plaintext mnemonic           │
│ - Error if password incorrect           │
└─────────────────────────────────────────┘
```

## Cryptographic Specifications

### Algorithm Details

| Component | Specification |
|-----------|--------------|
| **Encryption** | AES-256-CBC (NIST FIPS 197) |
| **Key Size** | 256 bits (32 bytes) |
| **IV Size** | 128 bits (16 bytes) |
| **Block Size** | 128 bits (16 bytes) |
| **KDF** | PBKDF2 (RFC 2898) |
| **Hash** | SHA-256 (NIST FIPS 180-4) |
| **Iterations** | 10,000 |
| **Salt** | 16 bytes (cryptographically random) |
| **Padding** | PKCS#7 (RFC 3852) |
| **Encoding** | Base64 (RFC 4648) |

### Ciphertext Format

```
Base64(Salt || Ciphertext)
├── Salt: 16 bytes (random)
└── Ciphertext: Variable length (AES-256-CBC output)
```

## Security Considerations

### Threat Model

**Protected Against:**
- ✅ Brute force attacks (strong passwords)
- ✅ Rainbow table attacks (unique salts)
- ✅ Weak password derivation (PBKDF2 with 10K iterations)
- ✅ Padding oracle attacks (PKCS#7 standard)
- ✅ Data interception (no network transmission)

**NOT Protected Against:**
- ❌ Weak user passwords
- ❌ Compromised devices (keyloggers, malware)
- ❌ Physical access to unlocked devices
- ❌ Side-channel attacks (timing, power analysis)
- ❌ Quantum computing (future threat)

### Security Trade-offs

| Decision | Rationale |
|----------|-----------|
| 10,000 iterations | Balance security vs mobile performance |
| No authentication | Relies on decryption failure detection |
| Display-only mode | Prevents accidental data persistence |
| QR code sharing | Convenient but visible to cameras |

## Cross-Platform Compatibility

### Why It Works

Both platforms use:
1. **Identical algorithms** (AES-256-CBC)
2. **Same KDF parameters** (PBKDF2, 10K iterations, SHA-256)
3. **Compatible libraries**:
   - Mobile: CryptoJS (JavaScript)
   - Desktop: PyCryptodome (Python)
4. **Standardized encoding** (Base64)

### Compatibility Matrix

| Operation | Mobile → Desktop | Desktop → Mobile |
|-----------|------------------|------------------|
| Encrypt/Decrypt | ✅ Full support | ✅ Full support |
| QR Code Transfer | ✅ Generate → Scan | ✅ Copy/paste |
| Password Strength | ✅ Mobile only | ❌ Not implemented |

## Performance Characteristics

### Mobile (React Native)

| Operation | Time (avg) | Notes |
|-----------|------------|-------|
| Encryption | ~500ms | PBKDF2 dominates |
| Decryption | ~500ms | Similar to encryption |
| QR Generation | ~100ms | Visual rendering |
| Password Check | ~10ms | Entropy calculation |

### Desktop (Python)

| Operation | Time (avg) | Notes |
|-----------|------------|-------|
| Encryption | ~200ms | Faster CPU |
| Decryption | ~200ms | Similar to encryption |
| Interactive Mode | Instant | Terminal I/O |

## Extensibility Points

### Adding New Features

1. **New encryption algorithms**: Extend `SecureEncryption` class
2. **Storage backends**: Implement in `utils/file_manager.py`
3. **UI screens**: Add to mobile `App.js` navigation
4. **CLI commands**: Extend `cli/main.py` menu system

### API Stability

**Stable (won't change):**
- Encryption/decryption format
- Base64 encoding
- PBKDF2 parameters

**May change:**
- UI/UX improvements
- Performance optimizations
- Additional features (non-breaking)

## Testing Strategy

### Unit Tests

```python
# desktop/tests/test_encryption.py
- test_encrypt_decrypt_roundtrip()
- test_wrong_password_fails()
- test_salt_randomness()
- test_cross_platform_compatibility()
```

### Integration Tests

- Mobile encryption → Desktop decryption
- Desktop encryption → Mobile decryption
- QR code generation → Scanning

### Security Tests

- Password strength validation
- Brute force resistance
- Memory cleanup after operations

## Deployment Architecture

### Mobile

```
Source Code → npm build → Expo bundler → APK/IPA
                              ↓
                         Google Play / App Store
```

### Desktop

```
Source Code → Python interpreter → Direct execution
           OR
           → PyInstaller → Standalone executable
```

## Future Architecture Considerations

### Planned Improvements

1. **Hardware Security Module (HSM) support**
2. **Biometric authentication** (mobile)
3. **Multi-key encryption** (Shamir's Secret Sharing)
4. **Cloud backup** (encrypted, optional)
5. **Desktop GUI** (Electron or Qt)

### Scalability

Currently designed for:
- Single-user operation
- Small data sizes (<10KB)
- Offline-first usage

Not suitable for:
- Multi-user systems
- Large file encryption
- Real-time collaborative editing

---

For implementation details, see source code documentation.
For security specifications, see [SECURITY.md](../SECURITY.md).
