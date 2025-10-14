"""
CryptoJS-Compatible AES Encryption for Python
This module provides the exact same encryption format as CryptoJS AES.encrypt()
"""

import os
import base64
import hashlib
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes


class CryptoJSAES:
    """Python implementation that produces identical output to CryptoJS AES.encrypt()"""

    @staticmethod
    def derive_key_and_iv(password: bytes, salt: bytes, key_len: int = 32, iv_len: int = 16):
        """
        Derive key and IV using the same method as CryptoJS (EVP_BytesToKey equivalent)
        This matches CryptoJS.kdf.OpenSSL.execute()
        """
        derived = b''
        h = b''

        while len(derived) < (key_len + iv_len):
            h = hashlib.md5(h + password + salt).digest()
            derived += h

        return derived[:key_len], derived[key_len:key_len + iv_len]

    @staticmethod
    def encrypt(plaintext: str, password: str) -> str:
        """
        Encrypt plaintext with password using CryptoJS-compatible format
        Returns base64 string in CryptoJS format: "Salted__" + salt + encrypted_data
        """
        # Generate random 8-byte salt (CryptoJS standard)
        salt = os.urandom(8)

        # Derive key and IV using CryptoJS method
        key, iv = CryptoJSAES.derive_key_and_iv(password.encode('utf-8'), salt)

        # Pad plaintext using PKCS7
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(plaintext.encode('utf-8'))
        padded_data += padder.finalize()

        # Encrypt using AES-256-CBC
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
        encryptor = cipher.encryptor()
        encrypted = encryptor.update(padded_data) + encryptor.finalize()

        # Format as CryptoJS: "Salted__" + salt + encrypted_data
        salted_prefix = b"Salted__"
        result = salted_prefix + salt + encrypted

        # Return base64 encoded
        return base64.b64encode(result).decode('ascii')

    @staticmethod
    def decrypt(encrypted_data: str, password: str) -> str:
        """
        Decrypt CryptoJS-format encrypted data
        """
        try:
            # Decode base64
            data = base64.b64decode(encrypted_data)

            # Check for "Salted__" prefix
            if not data.startswith(b"Salted__"):
                raise ValueError("Invalid CryptoJS format")

            # Extract salt and encrypted data
            salt = data[8:16]  # 8 bytes after "Salted__"
            encrypted = data[16:]

            # Derive key and IV
            key, iv = CryptoJSAES.derive_key_and_iv(password.encode('utf-8'), salt)

            # Decrypt
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
            decryptor = cipher.decryptor()
            padded_plaintext = decryptor.update(encrypted) + decryptor.finalize()

            # Remove padding
            unpadder = padding.PKCS7(128).unpadder()
            plaintext = unpadder.update(padded_plaintext)
            plaintext += unpadder.finalize()

            return plaintext.decode('utf-8')

        except Exception:
            return None


class SecureMnemonicEncryption:
    """Updated class using CryptoJS-compatible encryption"""

    # Mobile-optimized iterations
    PBKDF2_ITERATIONS = 10000
    SALT_SIZE = 16

    def __init__(self):
        pass

    def encrypt_mnemonic(self, mnemonic: str, password: str) -> str:
        """
        Encrypt mnemonic using CryptoJS-compatible format
        """
        if not mnemonic or not mnemonic.strip():
            raise ValueError("Mnemonic cannot be empty")
        if not password or len(password) < 8:
            raise ValueError("Password must be at least 8 characters")

        # Generate salt for PBKDF2
        salt = os.urandom(self.SALT_SIZE)

        # Derive key using PBKDF2 (same as Android)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=self.PBKDF2_ITERATIONS,
        )
        derived_key = kdf.derive(password.encode('utf-8'))

        # Convert key to hex string (same as Android key.toString())
        key_string = derived_key.hex()

        # Encrypt using CryptoJS-compatible method
        encrypted = CryptoJSAES.encrypt(mnemonic, key_string)

        # Format like Android: salt_hex + ':' + encrypted_data
        salt_hex = salt.hex()
        combined_format = f"{salt_hex}:{encrypted}"

        # Return base64 encoded result
        return base64.b64encode(combined_format.encode('utf-8')).decode('ascii')

    def decrypt_mnemonic(self, encrypted_data: str, password: str) -> str:
        """
        Decrypt mnemonic from Android/CryptoJS format
        """
        try:
            if not encrypted_data or not password:
                return None

            # Decode outer base64
            combined_format = base64.b64decode(encrypted_data).decode('utf-8')

            # Split salt and encrypted data
            parts = combined_format.split(':')
            if len(parts) != 2:
                return None

            salt_hex, encrypted_part = parts

            # Convert salt back to bytes
            salt = bytes.fromhex(salt_hex)

            # Derive the same key
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=self.PBKDF2_ITERATIONS,
            )
            derived_key = kdf.derive(password.encode('utf-8'))

            # Convert key to hex string
            key_string = derived_key.hex()

            # Decrypt using CryptoJS-compatible method
            decrypted = CryptoJSAES.decrypt(encrypted_part, key_string)

            return decrypted

        except Exception:
            return None

    def verify_mnemonic_format(self, mnemonic: str) -> bool:
        """Validate mnemonic format"""
        if not mnemonic or not mnemonic.strip():
            return False

        words = mnemonic.strip().split()
        valid_lengths = [12, 15, 18, 21, 24]

        if len(words) not in valid_lengths:
            return False

        for word in words:
            if not word.isalpha():
                return False

        return True


class PasswordStrengthChecker:
    """Utility class for checking password strength."""

    @staticmethod
    def calculate_entropy(password: str) -> float:
        """Calculate estimated entropy bits for a password."""
        if not password:
            return 0.0

        charset_size = 0
        if any(c.islower() for c in password):
            charset_size += 26
        if any(c.isupper() for c in password):
            charset_size += 26
        if any(c.isdigit() for c in password):
            charset_size += 10
        if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            charset_size += 23

        if charset_size == 0:
            return 0.0

        import math
        return len(password) * math.log2(charset_size)

    @staticmethod
    def check_password_strength(password: str) -> dict:
        """
        Check password strength and return detailed analysis.

        Returns:
            Dictionary with strength analysis
        """
        if not password:
            return {
                'score': 0,
                'strength': 'Very Weak',
                'entropy': 0.0,
                'recommendations': ['Password cannot be empty']
            }

        issues = []
        score = 0

        # Length check
        if len(password) < 8:
            issues.append('Use at least 8 characters (12+ recommended)')
        elif len(password) < 12:
            issues.append('Consider using 12+ characters for better security')
            score += 1
        else:
            score += 2

        # Character variety checks
        if any(c.islower() for c in password):
            score += 1
        else:
            issues.append('Add lowercase letters')

        if any(c.isupper() for c in password):
            score += 1
        else:
            issues.append('Add uppercase letters')

        if any(c.isdigit() for c in password):
            score += 1
        else:
            issues.append('Add numbers')

        if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            score += 1
        else:
            issues.append('Add special characters (!@#$%^&*)')

        # Calculate entropy
        entropy = PasswordStrengthChecker.calculate_entropy(password)

        # Determine strength level
        if score >= 6 and entropy >= 70:
            strength = 'Very Strong'
        elif score >= 5 and entropy >= 60:
            strength = 'Strong'
        elif score >= 4 and entropy >= 50:
            strength = 'Moderate'
        elif score >= 2:
            strength = 'Weak'
        else:
            strength = 'Very Weak'

        return {
            'score': score,
            'strength': strength,
            'entropy': entropy,
            'recommendations': issues
        }