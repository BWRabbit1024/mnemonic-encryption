# Privacy Policy for Mnemonic Encryption

**Last Updated: November 19, 2025**

## Overview

Mnemonic Encryption ("the App") is a security-focused application designed to encrypt and decrypt cryptocurrency mnemonic phrases using military-grade AES-256 encryption. This privacy policy explains how the App handles your data.

## Information Collection and Use

### Data We DO NOT Collect

The App is designed with privacy as a core principle. We **DO NOT**:

- Collect any personal information
- Store your mnemonic phrases on our servers
- Transmit your mnemonic phrases over the internet
- Track your usage or behavior
- Use analytics or telemetry services
- Share any data with third parties
- Store data in the cloud

### Data Stored Locally

The following data is stored **only on your device**:

1. **Premium Status**: Whether you have purchased premium features (stored in device's secure storage)
2. **App Preferences**: Settings like language preference and UI theme

**Important**: Your mnemonic phrases and passwords are **NEVER** stored anywhere. All encryption and decryption operations happen in memory only.

## Permissions Used

### Camera Permission (android.permission.CAMERA)

**Purpose**: Used exclusively for the QR code scanning feature (premium feature only).

**Usage**:
- Scans QR codes containing mnemonic phrases
- Performs OCR (Optical Character Recognition) on mnemonic phrase images
- Only activates when you explicitly choose to scan a QR code
- Camera feed is processed locally on your device
- No images or camera data are stored or transmitted

**You can deny this permission** - the app will continue to work, but QR code scanning features will be unavailable.

## Security

### Encryption Standards

- **Algorithm**: AES-256-CBC (NIST FIPS 197 compliant)
- **Key Derivation**: PBKDF2-HMAC-SHA256 with 10,000 iterations
- **All operations**: Performed locally on your device
- **No network transmission**: Your sensitive data never leaves your device

### Data Protection

1. Encrypted data is only stored temporarily in device memory
2. No persistent storage of unencrypted mnemonic phrases
3. Premium status uses device's secure storage (Android Keystore)
4. App clears sensitive data from memory after use

## Third-Party Services

### In-App Purchases

The App uses Google Play Billing for premium feature purchases. Google Play's privacy policy applies to payment processing:
- [Google Play Terms of Service](https://play.google.com/about/play-terms/)
- [Google Privacy Policy](https://policies.google.com/privacy)

**We do not have access to your payment information.** All payment data is handled exclusively by Google Play.

## Children's Privacy

The App does not knowingly collect information from children under 13 years of age. The App is not directed at children.

## Open Source

This App is open source. You can review the complete source code at:
https://github.com/bwrabbit1024/Python-Project/tree/main/05_mnemonic_encryption

## Data Retention

Since we don't collect or store any user data on servers, there is no data retention policy. All data exists only on your device and is under your control.

## Your Rights

You have complete control over your data:
- **Delete app data**: Uninstall the app or clear app data in Android settings
- **Revoke permissions**: Disable camera permission in Android settings
- **Export data**: Your encrypted data can be copied and backed up as text

## Changes to This Privacy Policy

We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.

## Security Considerations

### What You Should Know

1. **Password Security**: Your password is never stored. Choose a strong password and remember it - we cannot recover forgotten passwords.
2. **Backup Responsibility**: You are responsible for backing up your encrypted mnemonic phrases.
3. **Device Security**: Keep your device secure with a lock screen, as anyone with physical access to your device can access the app.

## Contact

For questions about this privacy policy or the App, please:
- Open an issue on GitHub: https://github.com/bwrabbit1024/Python-Project/issues
- Email: bwrabbit1024@gmail.com

## Disclaimer

This App is designed to encrypt sensitive cryptocurrency information. While we use industry-standard encryption, you use this App at your own risk. We recommend:
- Testing with non-critical data first
- Keeping multiple backups of your encrypted data
- Using strong, unique passwords
- Never sharing your passwords

## Legal Compliance

This privacy policy complies with:
- Google Play Developer Program Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

---

**Summary**: Mnemonic Encryption is a privacy-first application. We don't collect, store, or transmit your sensitive data. Everything happens locally on your device. Your mnemonic phrases and passwords are never stored anywhere.
