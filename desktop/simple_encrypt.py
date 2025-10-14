#!/usr/bin/env python3
"""
Simple Mnemonic Encryption Tool - Display Output Only
Shows encrypted text on screen instead of saving to files
"""

import sys
import os
import getpass


from crypto.secure_encryption import SecureMnemonicEncryption, PasswordStrengthChecker

def encrypt_and_display():
    """Encrypt mnemonic and display the result."""
    print("=== SECURE MNEMONIC ENCRYPTION ===")
    print("(Encrypted text will be displayed, not saved to file)")

    encryption = SecureMnemonicEncryption()
    password_checker = PasswordStrengthChecker()

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
        print("[ERROR] No mnemonic provided.")
        return

    # Validate mnemonic format
    if not encryption.verify_mnemonic_format(mnemonic):
        print("Warning: Mnemonic format doesn't match standard BIP39 format.")
        confirm = input("Continue anyway? (y/N): ").lower()
        if confirm != 'y':
            return

    # Get encryption password
    while True:
        password = getpass.getpass("Enter encryption password: ")
        if not password:
            print("[ERROR] Password cannot be empty.")
            continue

        if len(password) < 8:
            print("[ERROR] Password must be at least 8 characters.")
            continue

        # Check password strength
        strength = password_checker.check_password_strength(password)
        print(f"\nPassword strength: {strength['strength']} (Entropy: {strength['entropy']:.1f} bits)")

        if strength['recommendations']:
            print("Recommendations:")
            for rec in strength['recommendations']:
                print(f"  - {rec}")

        if strength['entropy'] < 50:
            confirm_weak = input("\nPassword is weak. Continue anyway? (y/N): ").lower()
            if confirm_weak != 'y':
                continue

        # Confirm password
        password_confirm = getpass.getpass("Confirm password: ")
        if password != password_confirm:
            print("[ERROR] Passwords do not match. Try again.")
            continue

        break

    try:
        # Encrypt the mnemonic
        print("\n[INFO] Encrypting mnemonic...")
        encrypted_data = encryption.encrypt_mnemonic(mnemonic, password)

        # Display the result
        print("\n" + "=" * 60)
        print("ENCRYPTED MNEMONIC (copy this text):")
        print("=" * 60)
        print(encrypted_data)
        print("=" * 60)

        print(f"\n[SUCCESS] Encryption completed!")
        print(f"[INFO] Encrypted data length: {len(encrypted_data)} characters")
        print(f"[INFO] Save this encrypted text somewhere safe")
        print(f"[WARNING] Keep your password safe - it cannot be recovered!")

        # Test decryption to make sure it works
        print(f"\n[INFO] Testing decryption...")
        test_decrypt = encryption.decrypt_mnemonic(encrypted_data, password)
        if test_decrypt == mnemonic:
            print(f"[SUCCESS] Encryption/decryption test passed")
        else:
            print(f"[ERROR] Encryption/decryption test failed!")

    except ValueError as e:
        print(f"[ERROR] {e}")
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")

def decrypt_from_text():
    """Decrypt mnemonic from pasted encrypted text."""
    print("=== DECRYPT MNEMONIC FROM TEXT ===")

    encryption = SecureMnemonicEncryption()

    # Get encrypted text
    print("\nPaste your encrypted mnemonic text:")
    encrypted_text = input().strip()

    if not encrypted_text:
        print("[ERROR] No encrypted text provided.")
        return

    # Get decryption password
    password = getpass.getpass("Enter decryption password: ")
    if not password:
        print("[ERROR] Password cannot be empty.")
        return

    # Decrypt
    print("\n[INFO] Decrypting...")
    decrypted_mnemonic = encryption.decrypt_mnemonic(encrypted_text, password)

    if decrypted_mnemonic:
        print("\n" + "=" * 60)
        print("DECRYPTED MNEMONIC:")
        print("=" * 60)
        print(decrypted_mnemonic)
        print("=" * 60)
        input("\nPress Enter to clear screen...")

        # Clear sensitive data from screen
        print("\n" * 50)
        print("Screen cleared for security.")
    else:
        print("[ERROR] Decryption failed. Check your password and encrypted text.")

def test_password_strength():
    """Test password strength."""
    print("=== PASSWORD STRENGTH CHECKER ===")

    password_checker = PasswordStrengthChecker()

    password = getpass.getpass("Enter password to test: ")
    if not password:
        print("[ERROR] No password provided.")
        return

    strength = password_checker.check_password_strength(password)

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

def main():
    """Main menu."""
    while True:
        print("\n" + "=" * 50)
        print("    SIMPLE MNEMONIC ENCRYPTION TOOL")
        print("=" * 50)
        print("1. Encrypt mnemonic (display result)")
        print("2. Decrypt from encrypted text")
        print("3. Test password strength")
        print("4. Exit")
        print("-" * 50)

        try:
            choice = input("Select option (1-4): ").strip()

            if choice == '1':
                encrypt_and_display()
            elif choice == '2':
                decrypt_from_text()
            elif choice == '3':
                test_password_strength()
            elif choice == '4':
                print("Goodbye!")
                break
            else:
                print("[ERROR] Invalid option. Please try again.")

        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"[ERROR] {e}")

if __name__ == "__main__":
    main()