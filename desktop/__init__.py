"""
Secure Mnemonic Encryption Package
A secure tool for encrypting cryptocurrency mnemonic phrases
"""

__version__ = "2.0.0"
__author__ = "Enhanced by Claude"

from crypto.secure_encryption import SecureMnemonicEncryption, PasswordStrengthChecker
from utils.file_manager import SecureFileManager, ConfigManager

__all__ = [
    'SecureMnemonicEncryption',
    'PasswordStrengthChecker',
    'SecureFileManager',
    'ConfigManager'
]