"""
Command Line Interface for Secure Mnemonic Encryption
Enhanced version with modern security practices
"""

import getpass
import sys
from typing import Optional
import argparse
import msvcrt  # For Windows getch functionality

from crypto.secure_encryption import SecureMnemonicEncryption, PasswordStrengthChecker


class MnemonicCLI:
    """Command-line interface for secure mnemonic encryption."""

    def __init__(self):
        """Initialize CLI with required components."""
        self.encryption = SecureMnemonicEncryption()
        self.password_checker = PasswordStrengthChecker()

    def get_password_with_asterisks(self, prompt: str) -> str:
        """Get password input with asterisk masking."""
        print(prompt, end='', flush=True)
        password = ""

        try:
            while True:
                char = msvcrt.getch()

                # Handle Enter key (carriage return)
                if char == b'\r':
                    print()  # New line
                    break

                # Handle Backspace
                elif char == b'\x08':
                    if password:
                        password = password[:-1]
                        print('\b \b', end='', flush=True)  # Erase last character

                # Handle Ctrl+C
                elif char == b'\x03':
                    raise KeyboardInterrupt

                # Handle regular characters (printable)
                elif 32 <= ord(char) <= 126:  # Printable ASCII characters
                    password += char.decode('utf-8')
                    print('*', end='', flush=True)

        except KeyboardInterrupt:
            print()
            raise

        return password

    def get_secure_password(self, prompt: str = "Enter password: ",
                           confirm: bool = True, check_strength: bool = True) -> Optional[str]:
        """
        Get password from user with optional confirmation and strength checking.

        Args:
            prompt: Password prompt message
            confirm: Whether to ask for password confirmation
            check_strength: Whether to check password strength

        Returns:
            Password string or None if cancelled
        """
        try:
            password = self.get_password_with_asterisks(prompt)

            if not password:
                print("Password cannot be empty.")
                return None

            if check_strength:
                strength = self.password_checker.check_password_strength(password)
                print(f"\nPassword strength: {strength['strength']} (Entropy: {strength['entropy']:.1f} bits)")

                if strength['recommendations']:
                    print("Recommendations:")
                    for rec in strength['recommendations']:
                        print(f"  - {rec}")

                if strength['entropy'] < 50:
                    confirm_weak = input("\nPassword is weak. Continue anyway? (y/N): ").lower()
                    if confirm_weak != 'y':
                        return None

            if confirm:
                password_confirm = self.get_password_with_asterisks("Confirm password: ")
                if password != password_confirm:
                    print("Passwords do not match.")
                    return None

            return password

        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            return None

    def encrypt_mnemonic_interactive(self) -> None:
        """Interactive mnemonic encryption."""
        print("=== Encrypt Mnemonic Phrase ===")

        # Get mnemonic from user
        print("\nEnter your mnemonic phrase:")
        print("(Press Enter twice when finished)")
        lines = []
        while True:
            line = input()
            if line == "" and lines:
                break
            if line:
                lines.append(line)

        mnemonic = " ".join(lines).strip()

        if not mnemonic:
            print("No mnemonic provided.")
            return

        # Validate mnemonic format
        if not self.encryption.verify_mnemonic_format(mnemonic):
            print("Warning: Mnemonic format doesn't match standard BIP39 format.")
            confirm = input("Continue anyway? (y/N): ").lower()
            if confirm != 'y':
                return

        # Get encryption password
        password = self.get_secure_password("Enter encryption password: ")
        if not password:
            return

        try:
            # Encrypt the mnemonic
            print("\n[INFO] Encrypting mnemonic...")
            encrypted_data = self.encryption.encrypt_mnemonic(mnemonic, password)

            # Display the encrypted result
            print("\n" + "=" * 60)
            print("ENCRYPTED MNEMONIC (copy this text):")
            print("=" * 60)
            print(encrypted_data)
            print("=" * 60)

            print(f"\n[SUCCESS] Encryption completed!")
            print(f"[INFO] Encrypted data length: {len(encrypted_data)} characters")
            print(f"[INFO] Save this encrypted text somewhere safe")
            print(f"[WARNING] Keep your password safe - it cannot be recovered!")

            # Test decryption to verify
            print(f"\n[INFO] Testing decryption...")
            test_decrypt = self.encryption.decrypt_mnemonic(encrypted_data, password)
            if test_decrypt == mnemonic:
                print(f"[SUCCESS] Encryption/decryption test passed")
            else:
                print(f"[ERROR] Encryption/decryption test failed!")

        except ValueError as e:
            print(f"[ERROR] Error: {e}")
        except Exception as e:
            print(f"[ERROR] Unexpected error: {e}")

    def decrypt_mnemonic_interactive(self) -> None:
        """Interactive mnemonic decryption from pasted text."""
        print("=== Decrypt Mnemonic from Encrypted Text ===")

        # Get encrypted text from user
        print("\nPaste your encrypted mnemonic text:")
        encrypted_text = input().strip()

        if not encrypted_text:
            print("[ERROR] No encrypted text provided.")
            return

        # Get decryption password
        password = self.get_password_with_asterisks("Enter decryption password: ")
        if not password:
            print("[ERROR] Password cannot be empty.")
            return

        # Decrypt
        print("\n[INFO] Decrypting...")
        decrypted_mnemonic = self.encryption.decrypt_mnemonic(encrypted_text, password)

        if decrypted_mnemonic:
            print("\n" + "=" * 60)
            print("DECRYPTED MNEMONIC PHRASE:")
            print("=" * 60)
            print(decrypted_mnemonic)
            print("=" * 60)
            input("\nPress Enter to clear screen...")

            # Clear sensitive data from screen
            print("\n" * 50)
            print("Screen cleared for security.")

        else:
            print("[ERROR] Decryption failed. Check your password and encrypted text.")

    def main_menu(self) -> None:
        """Display main menu and handle user interaction."""
        while True:
            print("\n" + "=" * 50)
            print("    SECURE MNEMONIC ENCRYPTION TOOL")
            print("=" * 50)
            print("1. Encrypt mnemonic phrase (display result)")
            print("2. Decrypt from encrypted text")
            print("3. Password strength checker")
            print("4. Exit")
            print("-" * 50)

            try:
                choice = input("Select option (1-4): ").strip()

                if choice == '1':
                    self.encrypt_mnemonic_interactive()
                elif choice == '2':
                    self.decrypt_mnemonic_interactive()
                elif choice == '3':
                    self.password_strength_test()
                elif choice == '4':
                    print("Goodbye!")
                    break
                else:
                    print("Invalid option. Please try again.")

            except KeyboardInterrupt:
                print("\n\nGoodbye!")
                break
            except Exception as e:
                print(f"Error: {e}")

    def password_strength_test(self) -> None:
        """Test password strength."""
        print("=== Password Strength Checker ===")

        password = self.get_password_with_asterisks("Enter password to test: ")
        if not password:
            print("No password provided.")
            return

        strength = self.password_checker.check_password_strength(password)

        print(f"\nPassword Analysis:")
        print(f"Strength: {strength['strength']}")
        print(f"Entropy: {strength['entropy']:.1f} bits")
        print(f"Score: {strength['score']}/6")

        if strength['recommendations']:
            print("\nRecommendations:")
            for rec in strength['recommendations']:
                print(f"  - {rec}")
        else:
            print("\n[SUCCESS] Password meets security requirements")


def create_argument_parser():
    """Create command line argument parser."""
    parser = argparse.ArgumentParser(
        description="Secure Mnemonic Encryption Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                 # Interactive mode
  python main.py --encrypt       # Direct encrypt mode
  python main.py --decrypt       # Direct decrypt mode
  python main.py --test-password # Test password strength
        """
    )

    parser.add_argument('--encrypt', action='store_true',
                        help='Go directly to encryption mode')
    parser.add_argument('--decrypt', action='store_true',
                        help='Go directly to decryption mode')
    parser.add_argument('--test-password', action='store_true',
                        help='Test password strength')

    return parser


def main():
    """Main entry point."""
    parser = create_argument_parser()
    args = parser.parse_args()

    cli = MnemonicCLI()

    if args.encrypt:
        cli.encrypt_mnemonic_interactive()
    elif args.decrypt:
        cli.decrypt_mnemonic_interactive()
    elif args.test_password:
        cli.password_strength_test()
    else:
        cli.main_menu()


if __name__ == "__main__":
    main()