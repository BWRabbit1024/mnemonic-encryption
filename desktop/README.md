# Secure Mnemonic Encryption - Desktop CLI

💻 Python command-line application for encrypting cryptocurrency mnemonic phrases with AES-256 encryption.

## Features

- 🔐 **AES-256-CBC encryption** with PBKDF2 key derivation
- 🖥️ **Interactive CLI** with password masking
- 🔄 **Cross-platform compatible** with mobile app
- 📋 **Display-only mode** - no file creation for security
- 🔒 **CryptoJS compatible** encryption format
- 🧪 **Unit tests** included

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

### Usage

```bash
# Interactive mode (recommended)
python cli/main.py

# Direct encryption
python cli/main.py --encrypt

# Direct decryption
python cli/main.py --decrypt
```

## Project Structure

```
desktop/
├── cli/
│   └── main.py                 # Command-line interface
│
├── crypto/
│   ├── secure_encryption.py    # Core encryption (CryptoJS compatible)
│   └── cryptojs_compatible.py  # Legacy compatibility
│
├── utils/
│   └── file_manager.py         # File operations (optional)
│
├── tests/
│   └── test_encryption.py      # Unit tests
│
├── requirements.txt            # Python dependencies
├── main.py                     # Entry point (optional)
├── simple_encrypt.py           # Simple example
└── debug_compatibility.py      # Debug utility
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `pycryptodome` | Latest | AES encryption |
| `colorama` | Latest | Terminal colors (optional) |

Install all:
```bash
pip install -r requirements.txt
```

## Usage Examples

### Interactive Mode

```bash
$ python cli/main.py

=== Secure Mnemonic Encryption ===
1. Encrypt text
2. Decrypt text
3. Exit
Choose option: 1

Enter text to encrypt: abandon abandon abandon...
Enter password: ********
Confirm password: ********

Encrypted text:
U2FsdGVkX1+...

(Copy and save this encrypted text securely)
```

### Command-Line Arguments

```bash
# Encrypt
python cli/main.py --encrypt

# Decrypt
python cli/main.py --decrypt

# Display help
python cli/main.py --help
```

### Python API

```python
from crypto.secure_encryption import SecureEncryption

# Encrypt
encryptor = SecureEncryption()
encrypted = encryptor.encrypt_text(
    plaintext="abandon abandon abandon...",
    password="YourStrongPassword123!"
)
print(encrypted)

# Decrypt
decrypted = encryptor.decrypt_text(
    ciphertext=encrypted,
    password="YourStrongPassword123!"
)
print(decrypted)
```

## Encryption Specifications

### Algorithm Details

```python
{
    "algorithm": "AES-256-CBC",
    "key_derivation": "PBKDF2",
    "hash_function": "SHA-256",
    "iterations": 10000,
    "salt_size": 16,  # bytes
    "key_size": 32,   # bytes (256 bits)
    "iv_size": 16,    # bytes (128 bits)
    "padding": "PKCS#7",
    "encoding": "Base64"
}
```

### Ciphertext Format

```
Base64(Salt || Ciphertext)
```

Where:
- `Salt`: 16 random bytes
- `Ciphertext`: AES-256-CBC encrypted data

## Cross-Platform Compatibility

✅ **Desktop → Mobile**: Encrypt on Python CLI, decrypt on React Native app
✅ **Mobile → Desktop**: Encrypt on mobile, decrypt on Python CLI
✅ **QR Code Support**: Copy encrypted text from mobile QR codes
✅ **Identical Format**: Same encryption standard across platforms

### Example

```python
# Desktop: Encrypt
python cli/main.py --encrypt
# Output: U2FsdGVkX1+...

# Mobile: Paste encrypted text and decrypt with same password
# Works perfectly!
```

## Testing

### Run Unit Tests

```bash
# Run all tests
python -m pytest tests/

# Run with coverage
python -m pytest tests/ --cov=crypto

# Run specific test
python -m pytest tests/test_encryption.py::test_encrypt_decrypt
```

### Test Scenarios

```python
# tests/test_encryption.py includes:
- test_encrypt_decrypt_roundtrip()
- test_wrong_password_fails()
- test_salt_randomness()
- test_empty_input_handling()
- test_special_characters()
- test_cross_platform_compatibility()
```

## Security Considerations

### ✅ Secure Practices

- Uses industry-standard AES-256-CBC
- PBKDF2 with 10,000 iterations
- Cryptographically secure random salts
- No data persistence by default
- Password input masked in terminal

### ⚠️ User Responsibilities

- Choose strong passwords (20+ characters recommended)
- Store password separately from encrypted data
- Test decryption before trusting backups
- Keep system and Python dependencies updated
- Use hardware wallets for primary crypto storage

## Advanced Usage

### Batch Encryption

```python
from crypto.secure_encryption import SecureEncryption

encryptor = SecureEncryption()
password = "YourStrongPassword123!"

mnemonics = [
    "abandon abandon abandon...",
    "zoo zoo zoo...",
    # ... more mnemonics
]

for i, mnemonic in enumerate(mnemonics):
    encrypted = encryptor.encrypt_text(mnemonic, password)
    print(f"Wallet {i+1}: {encrypted}")
```

### Custom Iterations

```python
from crypto.secure_encryption import SecureEncryption

# Higher iterations for more security (slower)
encryptor = SecureEncryption(iterations=100000)

encrypted = encryptor.encrypt_text(
    "your mnemonic here",
    "password"
)
```

**Note**: Changing iterations breaks compatibility with mobile app (10,000 iterations).

## Building Standalone Executable

### Using PyInstaller

```bash
# Install PyInstaller
pip install pyinstaller

# Build executable
pyinstaller --onefile cli/main.py

# Output: dist/main.exe (Windows) or dist/main (Linux/Mac)
```

### Distribution

```bash
# Windows
dist/main.exe

# Linux/Mac
./dist/main
```

## Troubleshooting

### Common Issues

**1. "ModuleNotFoundError: No module named 'Crypto'"**
```bash
# Fix:
pip install pycryptodome
# NOT pycrypto (outdated, insecure)
```

**2. "Wrong password or corrupted data"**
- Double-check password (case-sensitive)
- Verify encrypted text wasn't truncated
- Ensure no extra spaces/newlines

**3. "Password is too weak"**
```bash
# Use a stronger password:
# ❌ Weak: password123
# ✅ Strong: Correct-Horse-Battery-Staple-2024!
```

**4. Terminal encoding issues**
```bash
# Set UTF-8 encoding
export PYTHONIOENCODING=utf-8  # Linux/Mac
set PYTHONIOENCODING=utf-8     # Windows
```

## Performance

| Operation | Time (average) |
|-----------|---------------|
| Encryption | ~200ms |
| Decryption | ~200ms |
| Password check | Instant |

On slower systems or with higher iterations, times may increase proportionally.

## Development

### Code Style

```bash
# Format code
black crypto/ cli/ tests/

# Lint code
pylint crypto/ cli/ tests/

# Type check
mypy crypto/ cli/
```

### Adding Features

1. Create new module in `crypto/` or `cli/`
2. Add unit tests in `tests/`
3. Update `requirements.txt` if new dependencies
4. Update this README
5. Ensure cross-platform compatibility

## Comparison with Mobile App

| Feature | Desktop CLI | Mobile App |
|---------|------------|------------|
| Encryption | ✅ Yes | ✅ Yes |
| Decryption | ✅ Yes | ✅ Yes |
| QR Code Generation | ❌ No | ✅ Yes |
| QR Code Scanning | ❌ No | ✅ Yes |
| Password Strength Check | ❌ No | ✅ Yes |
| Interactive Menu | ✅ Yes | ✅ Yes |
| File Operations | ✅ Optional | ❌ No |
| Clipboard | ⚠️ Manual | ✅ Automatic |

## Migration from Old Version

### From AES_V1.2.py

**⚠️ WARNING**: AES_V1.2.py is INSECURE! Migrate immediately:

```bash
# 1. Decrypt with old version
python AES_V1.2.py  # decrypt your data

# 2. Re-encrypt with new version
python cli/main.py --encrypt

# 3. Test decryption
python cli/main.py --decrypt

# 4. Delete old version
rm AES_V1.2.py
```

**Important**: Old and new formats are NOT compatible!

## Support

- 📖 [Main Documentation](../README.md)
- 🏗️ [Architecture Guide](../docs/ARCHITECTURE.md)
- ❓ [FAQ](../docs/FAQ.md)
- 🔒 [Security Policy](../SECURITY.md)

## Contributing

See main [README.md](../README.md) for contribution guidelines.

## License

MIT License - see [LICENSE](../LICENSE)

---

Secure your crypto, trust mathematics ❤️
