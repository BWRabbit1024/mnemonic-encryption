"""
Unit tests for secure mnemonic encryption
Run with: python -m pytest tests/
"""

import pytest
import sys
import os

# Add src to path for testing
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from crypto.secure_encryption import SecureMnemonicEncryption, PasswordStrengthChecker


class TestSecureMnemonicEncryption:
    """Test cases for SecureMnemonicEncryption."""

    def setup_method(self):
        """Setup test instance."""
        self.encryption = SecureMnemonicEncryption()

    def test_encrypt_decrypt_basic(self):
        """Test basic encryption and decryption."""
        mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
        password = "SecurePassword123!"

        # Encrypt
        encrypted = self.encryption.encrypt_mnemonic(mnemonic, password)
        assert encrypted is not None
        assert len(encrypted) > 0

        # Decrypt
        decrypted = self.encryption.decrypt_mnemonic(encrypted, password)
        assert decrypted == mnemonic

    def test_encrypt_decrypt_different_passwords(self):
        """Test that different passwords produce different results."""
        mnemonic = "test mnemonic phrase for encryption"
        password1 = "Password123!"
        password2 = "DifferentPass456@"

        encrypted1 = self.encryption.encrypt_mnemonic(mnemonic, password1)
        encrypted2 = self.encryption.encrypt_mnemonic(mnemonic, password2)

        # Different passwords should produce different encrypted data
        assert encrypted1 != encrypted2

        # Should decrypt correctly with respective passwords
        assert self.encryption.decrypt_mnemonic(encrypted1, password1) == mnemonic
        assert self.encryption.decrypt_mnemonic(encrypted2, password2) == mnemonic

        # Should fail with wrong passwords
        assert self.encryption.decrypt_mnemonic(encrypted1, password2) is None
        assert self.encryption.decrypt_mnemonic(encrypted2, password1) is None

    def test_encrypt_same_mnemonic_different_results(self):
        """Test that encrypting the same mnemonic produces different results (due to random salt)."""
        mnemonic = "same mnemonic phrase"
        password = "SamePassword123!"

        encrypted1 = self.encryption.encrypt_mnemonic(mnemonic, password)
        encrypted2 = self.encryption.encrypt_mnemonic(mnemonic, password)

        # Should be different due to random salt
        assert encrypted1 != encrypted2

        # Both should decrypt to the same mnemonic
        assert self.encryption.decrypt_mnemonic(encrypted1, password) == mnemonic
        assert self.encryption.decrypt_mnemonic(encrypted2, password) == mnemonic

    def test_invalid_inputs(self):
        """Test handling of invalid inputs."""
        # Empty mnemonic
        with pytest.raises(ValueError):
            self.encryption.encrypt_mnemonic("", "password123")

        # Empty password
        with pytest.raises(ValueError):
            self.encryption.encrypt_mnemonic("test mnemonic", "")

        # Short password
        with pytest.raises(ValueError):
            self.encryption.encrypt_mnemonic("test mnemonic", "short")

    def test_verify_mnemonic_format(self):
        """Test mnemonic format verification."""
        # Valid 12-word mnemonic
        valid_12 = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
        assert self.encryption.verify_mnemonic_format(valid_12) is True

        # Valid 24-word mnemonic
        valid_24 = " ".join(["word"] * 24)
        assert self.encryption.verify_mnemonic_format(valid_24) is True

        # Invalid length (13 words)
        invalid_length = " ".join(["word"] * 13)
        assert self.encryption.verify_mnemonic_format(invalid_length) is False

        # Invalid characters (numbers)
        invalid_chars = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon 123"
        assert self.encryption.verify_mnemonic_format(invalid_chars) is False

        # Empty string
        assert self.encryption.verify_mnemonic_format("") is False

    def test_decrypt_invalid_data(self):
        """Test decryption with invalid data."""
        password = "ValidPassword123!"

        # Invalid base64
        assert self.encryption.decrypt_mnemonic("invalid_base64!", password) is None

        # Valid base64 but too short
        assert self.encryption.decrypt_mnemonic("dGVzdA==", password) is None

        # None inputs
        assert self.encryption.decrypt_mnemonic(None, password) is None
        assert self.encryption.decrypt_mnemonic("validdata", None) is None


class TestPasswordStrengthChecker:
    """Test cases for PasswordStrengthChecker."""

    def setup_method(self):
        """Setup test instance."""
        self.checker = PasswordStrengthChecker()

    def test_calculate_entropy(self):
        """Test entropy calculation."""
        # Empty password
        assert self.checker.calculate_entropy("") == 0.0

        # Simple password (only lowercase)
        entropy_simple = self.checker.calculate_entropy("password")
        assert entropy_simple > 0

        # Complex password (mixed case, numbers, symbols)
        entropy_complex = self.checker.calculate_entropy("Password123!")
        assert entropy_complex > entropy_simple

    def test_password_strength_levels(self):
        """Test password strength classification."""
        # Very weak password
        weak_result = self.checker.check_password_strength("123")
        assert weak_result['strength'] in ['Very Weak', 'Weak']

        # Moderate password
        moderate_result = self.checker.check_password_strength("Password123")
        assert moderate_result['entropy'] > weak_result['entropy']

        # Strong password
        strong_result = self.checker.check_password_strength("MySecurePassword123!")
        assert strong_result['entropy'] > moderate_result['entropy']
        assert len(strong_result['recommendations']) < len(weak_result['recommendations'])

    def test_password_recommendations(self):
        """Test that recommendations are provided for weak passwords."""
        # Password with missing elements
        result = self.checker.check_password_strength("password")

        recommendations = result['recommendations']
        assert any('uppercase' in rec.lower() for rec in recommendations)
        assert any('number' in rec.lower() for rec in recommendations)
        assert any('special' in rec.lower() for rec in recommendations)

    def test_empty_password(self):
        """Test handling of empty password."""
        result = self.checker.check_password_strength("")
        assert result['score'] == 0
        assert result['strength'] == 'Very Weak'
        assert result['entropy'] == 0.0
        assert 'empty' in result['recommendations'][0].lower()


if __name__ == "__main__":
    # Run tests directly
    pytest.main([__file__, "-v"])