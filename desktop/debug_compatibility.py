#!/usr/bin/env python3
"""
Debug script to test Python-Android encryption compatibility
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from crypto.secure_encryption import SecureMnemonicEncryption

def debug_encryption():
    """Test encryption and show detailed format."""
    encryption = SecureMnemonicEncryption()

    # Test data
    test_mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    test_password = "testpass123"

    print("=== DEBUGGING PYTHON ENCRYPTION ===")
    print(f"Test mnemonic: {test_mnemonic}")
    print(f"Test password: {test_password}")
    print(f"PBKDF2 iterations: {encryption.PBKDF2_ITERATIONS}")
    print()

    try:
        # Encrypt
        encrypted = encryption.encrypt_mnemonic(test_mnemonic, test_password)
        print(f"Encrypted result: {encrypted}")
        print(f"Length: {len(encrypted)} characters")
        print()

        # Try to decrypt our own encryption
        decrypted = encryption.decrypt_mnemonic(encrypted, test_password)
        print(f"Self-decryption result: {decrypted}")
        print(f"Self-decryption success: {decrypted == test_mnemonic}")
        print()

        # Show format breakdown
        import base64
        decoded = base64.b64decode(encrypted).decode('utf-8')
        print(f"Decoded format: {decoded}")
        parts = decoded.split(':')
        if len(parts) == 2:
            salt_hex, encrypted_part = parts
            print(f"Salt hex: {salt_hex} (length: {len(salt_hex)})")
            print(f"Encrypted part: {encrypted_part[:50]}... (length: {len(encrypted_part)})")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

def test_android_format():
    """Test with Android-style format to see differences."""
    print("\n=== TESTING ANDROID FORMAT SIMULATION ===")

    # Simulate Android format: salt.toString() + ':' + encrypted.toString()
    # where salt is 16 bytes hex and encrypted is CryptoJS AES result

    encryption = SecureMnemonicEncryption()

    # This is what Android would produce (hypothetical)
    android_style = "1234567890abcdef1234567890abcdef:U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIZ/cKBZvdXidzeQ="
    final_android = base64.b64encode(android_style.encode('utf-8')).decode('ascii')

    print(f"Simulated Android format: {android_style}")
    print(f"Final Android base64: {final_android}")

    # Try to decrypt
    try:
        result = encryption.decrypt_mnemonic(final_android, "testpass123")
        print(f"Decryption result: {result}")
    except Exception as e:
        print(f"Decryption failed: {e}")

if __name__ == "__main__":
    debug_encryption()
    test_android_format()