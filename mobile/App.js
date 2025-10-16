/**
 * Secure Mnemonic Encryption - React Native Mobile App
 * Converted from Python CLI version for Google Play Store
 * Hot reload test - port forwarding configured
 */

// IMPORTANT: Must be imported FIRST to enable crypto functionality
import 'react-native-get-random-values';

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform,
  BackHandler,
  AppState
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, Camera } from 'expo-camera';
import * as SecureStore from 'expo-secure-store';

import { SecureMnemonicEncryption, PasswordStrengthChecker } from './crypto/SecureEncryption';
import MnemonicScanModal from './components/MnemonicScanModal';
import { validateMnemonicWords } from './utils/bip39';
import Constants from 'expo-constants';
// Temporarily disabled - RevenueCat has package issues with Expo
// Will implement premium without RevenueCat for now
// import Purchases from 'react-native-purchases';

// Translation object
const translations = {
  en: {
    appTitle: 'Mnemonic Encryption',
    appSubtitle: 'Protect your cryptocurrency seed phrases',
    encrypt: 'Encrypt',
    encryptSubtext: 'Secure phrase',
    decrypt: 'Decrypt',
    decryptSubtext: 'Restore phrase',
    password: 'Password',
    passwordSubtext: 'Test strength',
    security: 'Security',
    securitySubtext: 'Security details',
    settings: 'Settings',
    settingsSubtext: 'App settings',
    qrCode: 'QR Code',
    qrCodeSubtext: 'Scan & create',
    version: 'Version',
    // QR Code screen
    qrCodeTitle: 'QR Code Tools',
    createQRCode: 'Create QR Code',
    scanQRCode: 'Scan QR Code',
    enterTextForQR: 'Enter text to generate QR code:',
    textForQRPlaceholder: 'Enter text, encrypted data, or any content...',
    generateQR: 'Generate QR',
    clearQR: 'Clear',
    qrCodeGenerated: 'QR Code Generated',
    saveOrShare: 'You can screenshot or share this QR code',
    scanDescription: 'Scan any QR code to extract its content',
    startScanning: 'Start Scanning',
    scannedContent: 'Scanned Content:',
    qrScanSuccess: 'QR code scanned successfully',
    // Settings screen
    settingsTitle: 'Settings',
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    chinese: 'Chinese (简体中文)',
    deviceMode: 'Device Mode',
    deviceModeDescription: 'Choose device connectivity mode',
    offlineMode: 'Offline Device',
    onlineMode: 'Internet Connected',
    offlineModeDesc: 'Full security - all features available',
    onlineModeDesc: 'Security disabled - encryption/decryption unavailable',
    onlineModeWarning: 'Security Warning',
    onlineModeWarningMsg: 'When Internet Connected mode is enabled, encryption and decryption features are disabled for security reasons. Your sensitive data should only be processed on an offline device.',
    // Premium features
    premium: 'Premium',
    upgradeToPremium: 'Upgrade to Premium',
    premiumFeatures: 'Premium Features',
    premiumActive: 'Premium Active',
    premiumDescription: 'Unlock convenience features',
    qrCodeGeneration: 'QR Code Generation',
    qrCodeScanning: 'QR Code Scanning',
    mnemonicRecognition: 'Mnemonic Recognition',
    quickDeviceTransfer: 'Quick Device Transfer',
    oneTimePurchase: 'One-time purchase • Lifetime access',
    restorePurchases: 'Restore Purchases',
    premiumFeature: 'Premium Feature',
    premiumPromptMessage: 'Premium features provide convenience for quick transfers.\n\nPremium includes:\n• QR Code Generation\n• QR Code Scanning\n• Mnemonic Recognition (OCR)\n• Quick device transfers\n\nOne-time payment: $4.99',
    maybeLater: 'Maybe Later',
    learnMore: 'Learn More',
    upgradeNow: 'Upgrade Now',
    success: 'Success',
    premiumUnlocked: 'Premium features unlocked!',
    purchaseFailed: 'Purchase Failed',
    premiumRestored: 'Premium access restored!',
    noPurchases: 'No Purchases',
    noPurchasesFound: 'No previous purchases found.',
    restoreFailed: 'Restore Failed',
    purchasing: 'Processing...',
    // Encrypt screen
    encryptTitle: 'Encrypt Mnemonic',
    mnemonicPhrase: 'Mnemonic Phrase:',
    mnemonicPlaceholder: 'Enter your 12-24 word mnemonic phrase (separate words with spaces) or tap \'Recognize\' button...',
    scan: 'Recognize',
    enterPassword: 'Enter a strong password',
    confirmPassword: 'Confirm Password:',
    confirmPasswordPlaceholder: 'Confirm your password',
    encryptButton: 'Encrypt',
    encrypting: 'Encrypting...',
    clear: 'Clear',
    encryptedText: 'Encrypted Text:',
    copy: 'Copy',
    showQR: 'Show QR',
    clearAll: 'Clear All',
    // Mnemonic validation
    validMnemonic: 'Valid mnemonic',
    invalidMnemonic: 'Invalid mnemonic',
    validWords: 'valid words',
    mnemonicRecognized: 'Mnemonic Recognized',
    mnemonicRecognizedDesc: 'Mnemonic has been added to the input field',
    // Decrypt screen
    decryptTitle: 'Decrypt Mnemonic',
    encryptedTextLabel: 'Encrypted Text:',
    encryptedTextPlaceholder: 'Paste encrypted text here or tap \'Scan QR\' button...',
    scanQR: 'Scan QR',
    enterYourPassword: 'Enter your password',
    decryptButton: 'Decrypt',
    decrypting: 'Decrypting...',
    decryptedMnemonic: 'Decrypted Mnemonic:',
    numberedPhrase: 'Numbered Phrase (BIP39 Validation):',
    // Password strength screen
    strengthTitle: 'Password Strength',
    testPassword: 'Test Password:',
    testPasswordPlaceholder: 'Enter password to test',
    checkStrength: 'Check Strength',
    checking: 'Checking...',
    passwordAnalysis: 'Password Analysis:',
    strength: 'Strength:',
    entropy: 'Entropy:',
    score: 'Score:',
    recommendations: 'Recommendations:',
    meetsRequirements: '✓ Password meets security requirements',
    // Security screen
    securityTitle: 'Security Information',
    securityOverview: 'Security Overview',
    securityDescription: 'Your mnemonic phrases are protected with military-grade encryption that works offline.',
    aes256Encryption: 'AES-256 Military-Grade Encryption',
    strongPasswordProtection: 'Strong Password Protection',
    pbkdf2KeyDerivation: 'PBKDF2 Key Derivation (10,000 iterations)',
    cryptographicSalt: 'Cryptographically Secure Random Salt',
    offlineEncryption: '100% Offline Processing',
    noDataStorage: 'No Sensitive Data Stored',
    crossPlatformCompatible: 'Cross-Platform Compatible',
    securityBestPractice: 'Security Best Practice',
    offlineRecommendation: 'For maximum security, we strongly recommend using this app on an ',
    offlineDevice: 'offline/air-gapped device',
    neverConnected: ' that is never connected to the internet.',
    airplaneMode: '• Use airplane mode during encryption',
    localOperations: '• All encryption happens on your device only',
    noNetwork: '• No internet connection required',
    secureEnvironment: 'This ensures your mnemonic phrases never leave your device.',
    backupTitle: 'Best Security Practices',
    backupDescription: 'Back up your password and encrypted output. ',
    backupDescriptionRed: 'Loss means permanent data loss. ',
    safeToStore: 'Encrypted output is safe to store anywhere',
    impossibleDecrypt: ' - it\'s useless without the password. ',
    offlineDeviceRecommendation: 'Best security: Use on an offline device',
    neverConnectedRecommendation: ' that never connects to the internet.',
    recommendedStorage: 'Best Storage Options:',
    passwordManagers: 'Password managers (1Password, Bitwarden, LastPass)',
    multipleLocations: 'Save copies in 2-3 different secure locations',
    keepPasswordSeparate: 'Store your password separately',
    separateAndSecure: ' from the encrypted text',
    neverStoreTogether: ' - never together!',
    qrCodeTransfer: 'Use QR code to transfer encrypted text to non-offline devices, maintaining the offline device completely offline.',
    encryptedTextStorageSuggestions: 'Encrypted Text Storage Suggestions',
    criticalWarning: '⚠️ CRITICAL SECURITY WARNING',
    criticalWarningText: 'NEVER store your password and encrypted text in the same location! If someone finds both, they can decrypt your mnemonic phrases.',
    // Alerts and Messages
    cameraPermissionRequired: 'Camera permission is required to scan QR codes',
    qrCodeScanned: 'Encrypted text has been imported from QR code',
    pleaseEnterMnemonic: 'Please enter a mnemonic phrase',
    pleaseEnterPassword: 'Please enter a password',
    passwordsDoNotMatch: 'Passwords do not match',
    mnemonicFormatWarning: 'Mnemonic format doesn\'t match standard BIP39 format. Continue anyway?',
    cancel: 'Cancel',
    continue: 'Continue',
    encryptionError: 'Encryption Error',
    encryptionSuccess: 'Mnemonic encrypted successfully!\n\nThe encrypted text is displayed below. Copy it to save somewhere safe.',
    encryptionVerificationFailed: 'Encryption verification failed',
    pleasePasteEncryptedText: 'Please paste your encrypted text',
    pleaseEnterYourPassword: 'Please enter your password',
    decryptionSuccess: 'Mnemonic decrypted successfully!\n\nPlease copy it quickly and clear the screen for security.',
    decryptionFailed: 'Decryption Failed',
    checkPasswordAndText: 'Check your password and encrypted text',
    decryptionError: 'Decryption Error',
    pleaseEnterPasswordToTest: 'Please enter a password to test',
    textCopiedToClipboard: 'Text copied to clipboard',
    failedToCopyToClipboard: 'Failed to copy to clipboard',
    mnemonicAddedToField: 'Mnemonic phrase has been added to the input field',
    // Modal dialogs
    qrCode: 'QR Code',
    scanQrCodeToGetText: 'Scan this QR code to get the encrypted text:',
    close: 'Close',
    scanQrCode: 'Scan QR Code',
    positionQrCodeInFrame: 'Position the QR code within the frame',
    requestingCameraPermission: 'Requesting camera permission...',
    noAccessToCamera: 'No access to camera',
    grantPermission: 'Grant Permission',
    // Mnemonic scanner
    scanMnemonic: 'Recognize',
    cameraPermissionRequiredForScan: 'Camera permission is required to scan mnemonic phrases',
    scanMnemonicPhrase: 'Scan Mnemonic Phrase',
    scanMnemonicPhrasesWithOrWithoutNumbers: 'Scan mnemonic phrases (with or without numbers)',
    offlineBip39Validation: '✓ 100% Offline • BIP39 Validation',
    gallery: 'Gallery',
    capture: 'Capture',
    processing: 'Processing...',
    validMnemonic: '✓ Valid Mnemonic',
    checkRequired: '⚠ Check Required',
    validWords: 'valid words',
    invalidLength: 'Invalid length (need 12/15/18/21/24)',
    noMnemonicPhrasesFound: 'No mnemonic phrases found',
    scanAgain: 'Scan Again',
    addToEncrypt: 'Add to Encrypt',
    fixErrorsFirst: 'Fix Errors First',
    noMnemonicPhrasesFoundAlert: 'No Mnemonic Phrases Found',
    couldNotFindMnemonicPhrases: 'Could not find mnemonic phrases. Please ensure:\n\n• Image contains text with mnemonic words\n• Image is clear and well-lit\n• Text is in focus and readable',
    validMnemonicPhrase: '✓ Valid Mnemonic Phrase',
    foundValidBip39Words: 'Found {count} valid BIP39 words in correct format.',
    invalidLengthAlert: '⚠ Invalid Length',
    foundWordsInvalidLength: 'Found {count} words. Valid lengths are 12, 15, 18, 21, or 24 words.',
    validationIssues: '⚠ Validation Issues',
    foundValidWords: 'Found {valid}/{total} valid BIP39 words. Check red-marked words below.',
    errorRecognizingText: 'Failed to recognize text from the image. Please try again.',
    errorCapturingPhoto: 'Failed to capture photo. Please try again.',
    errorPickingImage: 'Failed to pick image.',
    // Security information
    encryptionAlgorithm: 'Encryption Algorithm',
    standard: 'Standard:',
    aes256cbc: 'AES-256-CBC (Advanced Encryption Standard)',
    approval: 'Approval:',
    nistFips197: 'NIST FIPS 197 approved',
    keyLength: 'Key Length:',
    militaryGrade: '256-bit (military-grade)',
    blockSize: 'Block Size:',
    cbcMode: '128-bit CBC mode',
    keyDerivation: 'Key Derivation',
    function: 'Function:',
    pbkdf2: 'PBKDF2 (Password-Based Key Derivation Function 2)',
    standardIetf: 'Standard:',
    ietfRfc2898: 'IETF RFC 2898',
    hashAlgorithm: 'Hash Algorithm:',
    sha256: 'SHA-256',
    iterations: 'Iterations:',
    mobileOptimized: '10,000 (mobile-optimized)',
    securityFeatures: 'Security Features',
    saltGeneration: 'Salt Generation:',
    cryptographicallySecure: 'Cryptographically secure random (16 bytes)',
    paddingScheme: 'Padding Scheme:',
    pkcs7: 'PKCS#7 (RFC 3852)',
    encoding: 'Encoding:',
    base64: 'Base64 (RFC 4648)',
    dataStorage: 'Data Storage:',
    noSensitiveDataStored: 'No sensitive data stored on device',
    implementation: 'Implementation',
    mobileLibrary: 'Mobile Library:',
    cryptojs: 'CryptoJS (JavaScript)',
    desktopLibrary: 'Desktop Library:',
    pythonCryptography: 'Python cryptography',
    compatibility: 'Compatibility:',
    crossPlatformEncryption: 'Cross-platform encryption/decryption',
    platform: 'Platform:',
    expoSdk: 'Expo SDK 54, React Native',
    securityNotes: 'Security Notes',
    sameEncryptionStandards: '• This app uses the same encryption standards trusted by banks and government agencies worldwide.',
    allEncryptionOccursLocally: '• All encryption occurs locally on your device - no data is sent to external servers.',
    pbkdf2Iterations: '• The 10,000 PBKDF2 iterations provide strong protection while maintaining mobile performance.',
    randomSalts: '• Random salts prevent rainbow table attacks and ensure unique encryption each time.',
    // Detailed security specifications
    technicalSpecifications: 'Technical Specifications',
    encryptionAlgorithmDetail: 'Encryption Algorithm',
    algorithm: 'Algorithm:',
    aes256cbcDetail: 'AES-256-CBC (Advanced Encryption Standard)',
    compliance: 'Compliance:',
    nistFips197Detail: 'NIST FIPS 197 approved',
    keySize: 'Key Size:',
    bits256: '256 bits (32 bytes)',
    blockSizeDetail: 'Block Size:',
    bits128cbc: '128 bits (16 bytes) - CBC mode',
    keyDerivationDetail: 'Key Derivation Function',
    kdfFunction: 'Function:',
    pbkdf2Detail: 'PBKDF2 (Password-Based Key Derivation Function 2)',
    rfcStandard: 'Standard:',
    ietfRfc2898Detail: 'IETF RFC 2898',
    hashFunction: 'Hash Function:',
    sha256Detail: 'SHA-256 (NIST FIPS 180-4)',
    iterationsDetail: 'Iterations:',
    iterations10k: '10,000 (mobile-optimized for security/performance balance)',
    additionalSecurityFeatures: 'Additional Security Features',
    saltDetail: 'Salt Generation:',
    saltRandom: 'Cryptographically secure random (16 bytes)',
    paddingDetail: 'Padding Scheme:',
    pkcs7Detail: 'PKCS#7 (RFC 3852 standard)',
    encodingDetail: 'Encoding:',
    base64Detail: 'Base64 (RFC 4648 standard)',
    storageDetail: 'Data Storage:',
    noStorage: 'Zero persistent storage - all data in memory only',
    implementationDetails: 'Implementation Details',
    library: 'Cryptographic Library:',
    cryptojsLibrary: 'CryptoJS (industry-standard JavaScript crypto)',
    crossPlatform: 'Cross-Platform:',
    crossPlatformDetail: 'Compatible with desktop Python version',
    verification: 'Verification:',
    selfTest: 'Automatic encryption/decryption self-test on every operation',
  },
  zh: {
    appTitle: 'Mnemonic Encryption',
    appSubtitle: '保护您的加密货币种子短语',
    encrypt: '加密',
    encryptSubtext: '保护短语',
    decrypt: '解密',
    decryptSubtext: '恢复短语',
    password: '密码',
    passwordSubtext: '测试强度',
    security: '安全',
    securitySubtext: '安全详情',
    settings: '设置',
    settingsSubtext: '应用设置',
    qrCode: '二维码',
    qrCodeSubtext: '扫描和创建',
    version: 'Version',
    // QR Code screen
    qrCodeTitle: '二维码工具',
    createQRCode: '创建二维码',
    scanQRCode: '扫描二维码',
    enterTextForQR: '输入文本以生成二维码：',
    textForQRPlaceholder: '输入文本、加密数据或任何内容...',
    generateQR: '生成二维码',
    clearQR: '清除',
    qrCodeGenerated: '二维码已生成',
    saveOrShare: '您可以截屏或分享此二维码',
    scanDescription: '扫描任何二维码以提取其内容',
    startScanning: '开始扫描',
    scannedContent: '扫描内容：',
    qrScanSuccess: '二维码扫描成功',
    // Settings screen
    settingsTitle: '设置',
    language: '语言',
    selectLanguage: '选择语言',
    english: 'English',
    chinese: '简体中文',
    deviceMode: '设备模式',
    deviceModeDescription: '选择设备连接模式',
    offlineMode: '离线设备',
    onlineMode: '联网设备',
    offlineModeDesc: '完全安全 - 所有功能可用',
    onlineModeDesc: '安全已禁用 - 加密/解密不可用',
    onlineModeWarning: '安全警告',
    onlineModeWarningMsg: '当启用联网设备模式时，出于安全原因，加密和解密功能将被禁用。您的敏感数据应仅在离线设备上处理。',
    // Premium features
    premium: '高级版',
    upgradeToPremium: '升级到高级版',
    premiumFeatures: '高级功能',
    premiumActive: '高级版已激活',
    premiumDescription: '解锁便捷功能',
    qrCodeGeneration: '二维码生成',
    qrCodeScanning: '二维码扫描',
    mnemonicRecognition: '助记词识别',
    quickDeviceTransfer: '快速设备传输',
    oneTimePurchase: '一次性购买 • 终身访问',
    restorePurchases: '恢复购买',
    premiumFeature: '高级功能',
    premiumPromptMessage: '高级功能提供快速传输的便利性。\n\n高级版包括：\n• 二维码生成\n• 二维码扫描\n• 助记词识别（OCR）\n• 快速设备传输\n\n一次性付款：$4.99',
    maybeLater: '稍后再说',
    learnMore: '了解更多',
    upgradeNow: '立即升级',
    success: '成功',
    premiumUnlocked: '高级功能已解锁！',
    purchaseFailed: '购买失败',
    premiumRestored: '高级访问已恢复！',
    noPurchases: '无购买记录',
    noPurchasesFound: '未找到之前的购买记录。',
    restoreFailed: '恢复失败',
    purchasing: '处理中...',
    // Encrypt screen
    encryptTitle: '加密助记词',
    mnemonicPhrase: '助记词短语：',
    mnemonicPlaceholder: '输入您的12-24个单词的助记词短语（用空格分隔单词）或点击"识别"按钮...',
    scan: '识别',
    enterPassword: '输入强密码',
    confirmPassword: '确认密码：',
    confirmPasswordPlaceholder: '确认您的密码',
    encryptButton: '加密',
    encrypting: '加密中...',
    clear: '清除',
    encryptedText: '加密文本：',
    copy: '复制',
    showQR: '显示二维码',
    clearAll: '全部清除',
    // Mnemonic validation
    validMnemonic: '有效助记词',
    invalidMnemonic: '无效助记词',
    validWords: '有效单词',
    mnemonicRecognized: '助记词已识别',
    mnemonicRecognizedDesc: '助记词已添加到输入字段',
    // Decrypt screen
    decryptTitle: '解密助记词',
    encryptedTextLabel: '加密文本：',
    encryptedTextPlaceholder: '在此处粘贴加密文本或点击"扫描二维码"按钮...',
    scanQR: '扫描二维码',
    enterYourPassword: '输入您的密码',
    decryptButton: '解密',
    decrypting: '解密中...',
    decryptedMnemonic: '解密的助记词：',
    numberedPhrase: '编号短语（BIP39验证）：',
    // Password strength screen
    strengthTitle: '密码强度',
    testPassword: '测试密码：',
    testPasswordPlaceholder: '输入要测试的密码',
    checkStrength: '检查强度',
    checking: '检查中...',
    passwordAnalysis: '密码分析：',
    strength: '强度：',
    entropy: '熵值：',
    score: '得分：',
    recommendations: '建议：',
    meetsRequirements: '✓ 密码符合安全要求',
    // Security screen
    securityTitle: '安全信息',
    securityOverview: '安全概览',
    securityDescription: '您的助记词受到军用级加密保护，支持离线使用。',
    aes256Encryption: 'AES-256 军用级加密',
    strongPasswordProtection: '强密码保护',
    pbkdf2KeyDerivation: 'PBKDF2 密钥派生（10,000次迭代）',
    cryptographicSalt: '密码学安全随机盐值',
    offlineEncryption: '100% 离线处理',
    noDataStorage: '不存储敏感数据',
    crossPlatformCompatible: '跨平台兼容',
    securityBestPractice: '安全最佳实践',
    offlineRecommendation: '为了最大程度的安全，我们强烈建议在',
    offlineDevice: '离线/隔离设备',
    neverConnected: '上使用此应用，该设备永远不连接到互联网。',
    airplaneMode: '• 加密时使用飞行模式',
    localOperations: '• 所有加密仅在您的设备上执行',
    noNetwork: '• 不需要互联网连接',
    secureEnvironment: '这确保您的助记词短语永远不会离开您的设备。',
    backupTitle: '最佳安全实践',
    backupDescription: '备份您的密码和加密输出。',
    backupDescriptionRed: '遗失意味着数据永久丢失。',
    safeToStore: '加密输出可安全存储于任意位置',
    impossibleDecrypt: ' - 没有密码毫无用处。',
    offlineDeviceRecommendation: '最佳安全：使用从未联网的离线设备',
    neverConnectedRecommendation: '。',
    recommendedStorage: '最佳存储选项：',
    passwordManagers: '密码管理器（1Password、Bitwarden、LastPass）',
    multipleLocations: '在2-3个不同的安全位置保存副本',
    keepPasswordSeparate: '将您的密码单独存储',
    separateAndSecure: '，与加密文本分开',
    neverStoreTogether: ' - 永远不要放在一起！',
    qrCodeTransfer: '使用二维码将加密文本传输到非离线设备，同时保持离线设备的完全离线状态。',
    encryptedTextStorageSuggestions: '加密文本存储建议',
    criticalWarning: '⚠️ 关键安全警告',
    criticalWarningText: '永远不要将您的密码和加密文本存储在同一位置！如果有人同时找到两者，他们就可以解密您的助记词。',
    // Alerts and Messages
    cameraPermissionRequired: '需要相机权限来扫描二维码',
    qrCodeScanned: '已从二维码导入加密文本',
    pleaseEnterMnemonic: '请输入助记词短语',
    pleaseEnterPassword: '请输入密码',
    passwordsDoNotMatch: '密码不匹配',
    mnemonicFormatWarning: '助记词格式不符合标准BIP39格式。是否继续？',
    cancel: '取消',
    continue: '继续',
    encryptionError: '加密错误',
    encryptionSuccess: '助记词加密成功！\n\n加密文本显示在下方。请复制并安全保存。',
    encryptionVerificationFailed: '加密验证失败',
    pleasePasteEncryptedText: '请粘贴您的加密文本',
    pleaseEnterYourPassword: '请输入您的密码',
    decryptionSuccess: '助记词解密成功！\n\n请快速复制并清除屏幕以确保安全。',
    decryptionFailed: '解密失败',
    checkPasswordAndText: '请检查您的密码和加密文本',
    decryptionError: '解密错误',
    pleaseEnterPasswordToTest: '请输入要测试的密码',
    textCopiedToClipboard: '文本已复制到剪贴板',
    failedToCopyToClipboard: '复制到剪贴板失败',
    mnemonicAddedToField: '助记词短语已添加到输入字段',
    // Modal dialogs
    qrCode: '二维码',
    scanQrCodeToGetText: '扫描此二维码获取加密文本：',
    close: '关闭',
    scanQrCode: '扫描二维码',
    positionQrCodeInFrame: '将二维码放在框架内',
    requestingCameraPermission: '正在请求相机权限...',
    noAccessToCamera: '无法访问相机',
    grantPermission: '授予权限',
    // Mnemonic scanner
    scanMnemonic: '识别',
    cameraPermissionRequiredForScan: '需要相机权限来扫描助记词短语',
    scanMnemonicPhrase: '扫描助记词短语',
    scanMnemonicPhrasesWithOrWithoutNumbers: '扫描助记词短语（带或不带数字）',
    offlineBip39Validation: '✓ 100% 离线 • BIP39验证',
    gallery: '相册',
    capture: '拍摄',
    processing: '处理中...',
    validMnemonic: '✓ 有效助记词',
    checkRequired: '⚠ 需要检查',
    validWords: '有效单词',
    invalidLength: '无效长度（需要12/15/18/21/24）',
    noMnemonicPhrasesFound: '未找到助记词短语',
    scanAgain: '重新扫描',
    addToEncrypt: '添加到加密',
    fixErrorsFirst: '请先修复错误',
    noMnemonicPhrasesFoundAlert: '未找到助记词短语',
    couldNotFindMnemonicPhrases: '无法找到助记词短语。请确保：\n\n• 图像包含助记词文本\n• 图像清晰且光线充足\n• 文本清晰可读',
    validMnemonicPhrase: '✓ 有效助记词短语',
    foundValidBip39Words: '找到{count}个有效BIP39单词，格式正确。',
    invalidLengthAlert: '⚠ 无效长度',
    foundWordsInvalidLength: '找到{count}个单词。有效长度为12、15、18、21或24个单词。',
    validationIssues: '⚠ 验证问题',
    foundValidWords: '找到{valid}/{total}个有效BIP39单词。请检查下面标红的单词。',
    errorRecognizingText: '无法识别图像中的文本。请重试。',
    errorCapturingPhoto: '拍摄照片失败。请重试。',
    errorPickingImage: '选择图像失败。',
    // Security information
    encryptionAlgorithm: '加密算法',
    standard: '标准：',
    aes256cbc: 'AES-256-CBC（高级加密标准）',
    approval: '批准：',
    nistFips197: 'NIST FIPS 197批准',
    keyLength: '密钥长度：',
    militaryGrade: '256位（军用级）',
    blockSize: '块大小：',
    cbcMode: '128位CBC模式',
    keyDerivation: '密钥派生',
    function: '函数：',
    pbkdf2: 'PBKDF2（基于密码的密钥派生函数2）',
    standardIetf: '标准：',
    ietfRfc2898: 'IETF RFC 2898',
    hashAlgorithm: '哈希算法：',
    sha256: 'SHA-256',
    iterations: '迭代次数：',
    mobileOptimized: '10,000（移动端优化）',
    securityFeatures: '安全功能',
    saltGeneration: '盐生成：',
    cryptographicallySecure: '密码学安全随机（16字节）',
    paddingScheme: '填充方案：',
    pkcs7: 'PKCS#7（RFC 3852）',
    encoding: '编码：',
    base64: 'Base64（RFC 4648）',
    dataStorage: '数据存储：',
    noSensitiveDataStored: '设备上不存储敏感数据',
    implementation: '实现',
    mobileLibrary: '移动库：',
    cryptojs: 'CryptoJS（JavaScript）',
    desktopLibrary: '桌面库：',
    pythonCryptography: 'Python cryptography',
    compatibility: '兼容性：',
    crossPlatformEncryption: '跨平台加密/解密',
    platform: '平台：',
    expoSdk: 'Expo SDK 54, React Native',
    securityNotes: '安全说明',
    sameEncryptionStandards: '• 此应用使用银行和政府机构信任的相同加密标准。',
    allEncryptionOccursLocally: '• 所有加密都在您的设备本地进行 - 不会向外部服务器发送数据。',
    pbkdf2Iterations: '• 10,000次PBKDF2迭代在保持移动性能的同时提供强保护。',
    randomSalts: '• 随机盐防止彩虹表攻击并确保每次加密的唯一性。',
    // Detailed security specifications
    technicalSpecifications: '技术规格',
    encryptionAlgorithmDetail: '加密算法',
    algorithm: '算法：',
    aes256cbcDetail: 'AES-256-CBC（高级加密标准）',
    compliance: '合规性：',
    nistFips197Detail: 'NIST FIPS 197批准',
    keySize: '密钥大小：',
    bits256: '256位（32字节）',
    blockSizeDetail: '块大小：',
    bits128cbc: '128位（16字节）- CBC模式',
    keyDerivationDetail: '密钥派生函数',
    kdfFunction: '函数：',
    pbkdf2Detail: 'PBKDF2（基于密码的密钥派生函数2）',
    rfcStandard: '标准：',
    ietfRfc2898Detail: 'IETF RFC 2898',
    hashFunction: '哈希函数：',
    sha256Detail: 'SHA-256（NIST FIPS 180-4）',
    iterationsDetail: '迭代次数：',
    iterations10k: '10,000次（移动端优化，平衡安全性与性能）',
    additionalSecurityFeatures: '附加安全功能',
    saltDetail: '盐生成：',
    saltRandom: '密码学安全随机（16字节）',
    paddingDetail: '填充方案：',
    pkcs7Detail: 'PKCS#7（RFC 3852标准）',
    encodingDetail: '编码：',
    base64Detail: 'Base64（RFC 4648标准）',
    storageDetail: '数据存储：',
    noStorage: '零持久存储 - 所有数据仅在内存中',
    implementationDetails: '实现细节',
    library: '加密库：',
    cryptojsLibrary: 'CryptoJS（行业标准JavaScript加密库）',
    crossPlatform: '跨平台：',
    crossPlatformDetail: '与桌面Python版本兼容',
    verification: '验证：',
    selfTest: '每次操作自动加密/解密自检',
  }
};

export default function App() {
  // State for current screen
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'encrypt', 'decrypt', 'strength', 'security', 'qrcode', 'settings'

  // State for language
  const [language, setLanguage] = useState('en'); // 'en' or 'zh'

  // State for device mode
  const [isOnlineMode, setIsOnlineMode] = useState(false); // false = offline (default), true = online

  // State for encryption
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEncryptPassword, setShowEncryptPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for decryption
  const [encryptedInput, setEncryptedInput] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [showDecryptPassword, setShowDecryptPassword] = useState(false);

  // State for mnemonic scan
  const [showMnemonicScanner, setShowMnemonicScanner] = useState(false);

  // State for password strength
  const [testPassword, setTestPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isCheckingStrength, setIsCheckingStrength] = useState(false);
  const [showTestPassword, setShowTestPassword] = useState(false);

  // State for QR Code screen
  const [qrText, setQrText] = useState('');
  const [generatedQRData, setGeneratedQRData] = useState('');
  const [scannedQRData, setScannedQRData] = useState('');
  const [isQRScanning, setIsQRScanning] = useState(false);

  // State for Premium features
  const [isPremium, setIsPremium] = useState(false); // For development: set to false to test premium prompts
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // State for mnemonic validation
  const [mnemonicValidation, setMnemonicValidation] = useState(null);

  const encryption = new SecureMnemonicEncryption();

  // Get current translations
  const t = translations[language];

  // Auto-clear timer ref (5 minutes = 300000ms)
  const autoClearTimerRef = useRef(null);
  const AUTO_CLEAR_DELAY = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Function to clear all sensitive data
  const clearAllSensitiveData = () => {
    console.log('[Security] Auto-clearing all sensitive data after 5 minutes of inactivity');

    // Clear encryption data
    setMnemonic('');
    setPassword('');
    setConfirmPassword('');
    setEncryptedResult('');

    // Clear decryption data
    setEncryptedInput('');
    setDecryptPassword('');
    setDecryptedResult('');

    // Clear password test data
    setTestPassword('');
    setPasswordStrength(null);

    // Clear QR data
    setQrText('');
    setGeneratedQRData('');
    setScannedQRData('');

    // Clear mnemonic validation
    setMnemonicValidation(null);

    // Return to home screen for security
    setCurrentScreen('home');
  };

  // Start auto-clear timer
  const startAutoClearTimer = () => {
    // Clear any existing timer
    if (autoClearTimerRef.current) {
      clearTimeout(autoClearTimerRef.current);
    }

    // Start new timer
    autoClearTimerRef.current = setTimeout(() => {
      clearAllSensitiveData();
    }, AUTO_CLEAR_DELAY);

    console.log('[Security] Auto-clear timer started (5 minutes)');
  };

  // Cancel auto-clear timer
  const cancelAutoClearTimer = () => {
    if (autoClearTimerRef.current) {
      clearTimeout(autoClearTimerRef.current);
      autoClearTimerRef.current = null;
      console.log('[Security] Auto-clear timer cancelled');
    }
  };

  // Initialize RevenueCat and check premium status
  useEffect(() => {
    const initializePurchases = async () => {
      try {
        // For development/testing only - set to true to bypass premium checks
        // In production, this will be false and check real purchases
        const TESTING_MODE = true;  // Set to false for production

        if (TESTING_MODE) {
          // For testing: you can toggle isPremium state manually
          console.log('[Premium] Running in test mode - isPremium:', isPremium);
          return;
        }

        // Production code - configure RevenueCat
        // Note: You'll need to add your RevenueCat API keys before production
        if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: 'YOUR_ANDROID_API_KEY_HERE' });
        } else if (Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: 'YOUR_IOS_API_KEY_HERE' });
        }

        // Check current customer info
        const customerInfo = await Purchases.getCustomerInfo();
        const hasAccess = typeof customerInfo.entitlements.active['premium'] !== 'undefined';
        setIsPremium(hasAccess);
        console.log('[Premium] Premium status:', hasAccess);
      } catch (error) {
        console.error('[Premium] Failed to initialize:', error);
        // Default to free if initialization fails
        setIsPremium(false);
      }
    };

    initializePurchases();
  }, []);

  // Auto-clear sensitive data when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App went to background - start auto-clear timer
        startAutoClearTimer();
      } else if (nextAppState === 'active') {
        // App came back to foreground - cancel timer
        cancelAutoClearTimer();
      }
    });

    return () => {
      subscription.remove();
      cancelAutoClearTimer(); // Clean up timer on unmount
    };
  }, []);

  // Purchase premium function
  const purchasePremium = async () => {
    try {
      setIsPurchasing(true);

      // Get available offerings
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        const productPackage = offerings.current.availablePackages[0];
        const { customerInfo } = await Purchases.purchasePackage(productPackage);

        // Check if purchase was successful
        if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
          setIsPremium(true);
          // Save to SecureStore for offline persistence
          await SecureStore.setItemAsync('premiumStatus', 'true');
          setShowPremiumModal(false);
          Alert.alert(t.success || 'Success', t.premiumUnlocked || 'Premium features unlocked!');
        }
      }
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert(t.purchaseFailed || 'Purchase Failed', error.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  // Restore purchases function
  const restorePurchases = async () => {
    try {
      // For testing mode, just toggle premium status
      const TESTING_MODE = true;
      if (TESTING_MODE) {
        // Toggle premium for testing
        const newPremiumStatus = !isPremium;
        setIsPremium(newPremiumStatus);
        await SecureStore.setItemAsync('premiumStatus', newPremiumStatus ? 'true' : 'false');
        Alert.alert(
          t.success || 'Success',
          newPremiumStatus
            ? 'Premium activated for testing!'
            : 'Premium deactivated for testing!'
        );
        return;
      }

      // Production mode - use RevenueCat
      const customerInfo = await Purchases.restorePurchases();
      const hasAccess = typeof customerInfo.entitlements.active['premium'] !== 'undefined';

      if (hasAccess) {
        setIsPremium(true);
        // Save to SecureStore for offline persistence
        await SecureStore.setItemAsync('premiumStatus', 'true');
        Alert.alert(t.success || 'Success', t.premiumRestored || 'Premium access restored!');
      } else {
        Alert.alert(t.noPurchases || 'No Purchases', t.noPurchasesFound || 'No previous purchases found.');
      }
    } catch (error) {
      Alert.alert(t.restoreFailed || 'Restore Failed', error.message);
    }
  };

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      // If mnemonic scanner is open, close it first
      if (showMnemonicScanner) {
        setShowMnemonicScanner(false);
        return true;
      }

      // If QR scanner is open, close it first
      if (showQRScanner) {
        setShowQRScanner(false);
        return true;
      }

      // If QR code scanning is active, close it first
      if (isQRScanning) {
        setIsQRScanning(false);
        return true;
      }

      // If QR modal is open, close it first
      if (showQRModal) {
        setShowQRModal(false);
        return true;
      }

      // If we're not on the home screen, navigate back to home
      if (currentScreen !== 'home') {
        setCurrentScreen('home');
        return true; // Prevent default behavior (minimizing app)
      }

      // If we're on home screen, let the default behavior happen (exit app)
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [currentScreen, showQRScanner, showQRModal, showMnemonicScanner]);

  // Load saved preferences on app start
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load device mode
        const savedDeviceMode = await SecureStore.getItemAsync('deviceMode');
        if (savedDeviceMode !== null) {
          setIsOnlineMode(savedDeviceMode === 'online');
        }

        // Load premium status from SecureStore
        const savedPremiumStatus = await SecureStore.getItemAsync('premiumStatus');
        if (savedPremiumStatus === 'true') {
          setIsPremium(true);
          console.log('[Premium] Loaded from SecureStore: Premium active');
        } else {
          console.log('[Premium] Loaded from SecureStore: Free user');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Save device mode preference when it changes
  const handleDeviceModeChange = async (onlineMode) => {
    try {
      await SecureStore.setItemAsync('deviceMode', onlineMode ? 'online' : 'offline');
      setIsOnlineMode(onlineMode);

      // Show warning when switching to online mode
      if (onlineMode) {
        Alert.alert(
          t.onlineModeWarning,
          t.onlineModeWarningMsg,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error saving device mode:', error);
      Alert.alert('Error', 'Failed to save device mode preference');
    }
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setShowQRScanner(true);
    } else {
      Alert.alert(t.cameraPermissionRequired, t.cameraPermissionRequired);
    }
  };

  // Handle QR code scan
  const handleBarCodeScanned = ({ type, data }) => {
    setShowQRScanner(false);
    setEncryptedInput(data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(t.qrCodeScanned, t.qrCodeScanned);
  };

  // Handle encryption
  const handleEncrypt = () => {
    if (isEncrypting) return; // Prevent multiple clicks

    try {
      // Validation
      if (!mnemonic.trim()) {
        Alert.alert(t.encryptionError, t.pleaseEnterMnemonic);
        return;
      }

      if (!password) {
        Alert.alert(t.encryptionError, t.pleaseEnterPassword);
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert(t.encryptionError, t.passwordsDoNotMatch);
        return;
      }

      // Check mnemonic format
      if (!encryption.verifyMnemonicFormat(mnemonic)) {
        Alert.alert(
          t.encryptionError,
          t.mnemonicFormatWarning,
          [
            { text: t.cancel, style: 'cancel' },
            { text: t.continue, onPress: performEncryption }
          ]
        );
        return;
      }

      performEncryption();
    } catch (error) {
      Alert.alert(t.encryptionError, error.message);
    }
  };

  const performEncryption = () => {
    setIsEncrypting(true);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      try {
        console.log('Starting encryption...');
        const encrypted = encryption.encryptMnemonic(mnemonic, password);
        console.log('Encryption completed:', encrypted.substring(0, 50) + '...');
        setEncryptedResult(encrypted);

        // Test decryption to verify
        const testDecrypt = encryption.decryptMnemonic(encrypted, password);
        if (testDecrypt === mnemonic) {
          console.log('Verification successful');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(t.encryptionSuccess, t.encryptionSuccess);
        } else {
          console.log('Verification failed');
          Alert.alert(t.encryptionError, t.encryptionVerificationFailed);
        }
      } catch (error) {
        console.error('Encryption error:', error);
        Alert.alert(t.encryptionError, error.message);
      } finally {
        setIsEncrypting(false);
      }
    }, 100); // Small delay to allow UI update
  };

  // Handle decryption
  const handleDecrypt = () => {
    if (isDecrypting) return; // Prevent multiple clicks

    try {
      if (!encryptedInput.trim()) {
        Alert.alert(t.decryptionError, t.pleasePasteEncryptedText);
        return;
      }

      if (!decryptPassword) {
        Alert.alert(t.decryptionError, t.pleaseEnterYourPassword);
        return;
      }

      setIsDecrypting(true);

      // Use setTimeout to allow UI to update before computation
      setTimeout(() => {
        try {
          const decrypted = encryption.decryptMnemonic(encryptedInput, decryptPassword);

          if (decrypted) {
            setDecryptedResult(decrypted);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
              t.decryptionSuccess,
              t.decryptionSuccess,
              [
                { text: 'OK', onPress: () => {} }
              ]
            );
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(t.decryptionFailed, t.checkPasswordAndText);
          }
        } catch (error) {
          Alert.alert(t.decryptionError, error.message);
        } finally {
          setIsDecrypting(false);
        }
      }, 100);
    } catch (error) {
      Alert.alert(t.decryptionError, error.message);
      setIsDecrypting(false);
    }
  };

  // Handle password strength check
  const handlePasswordStrength = () => {
    if (isCheckingStrength) return; // Prevent multiple clicks

    if (!testPassword) {
      Alert.alert(t.encryptionError, t.pleaseEnterPasswordToTest);
      return;
    }

    setIsCheckingStrength(true);

    // Use setTimeout to show loading state
    setTimeout(() => {
      const strength = PasswordStrengthChecker.checkPasswordStrength(testPassword);
      setPasswordStrength(strength);
      setIsCheckingStrength(false);
    }, 100);
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Alert.alert(t.textCopiedToClipboard, t.textCopiedToClipboard);
    } catch (error) {
      console.error('Clipboard error:', error);
      Alert.alert(t.encryptionError, t.failedToCopyToClipboard);
    }
  };

  // Clear sensitive data (decrypt screen)
  const clearDecryptScreen = () => {
    setDecryptedResult('');
    setDecryptPassword('');
    setEncryptedInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Clear all data (encrypt screen)
  const clearEncryptScreen = () => {
    setMnemonic('');
    setPassword('');
    setConfirmPassword('');
    setEncryptedResult('');
    setMnemonicValidation(null); // Clear validation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Clear password strength screen
  const clearStrengthScreen = () => {
    setTestPassword('');
    setPasswordStrength(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Handle mnemonic recognized from scan
  const handleMnemonicRecognized = (mnemonicText) => {
    setMnemonic(mnemonicText);

    // Validate the mnemonic words
    const words = mnemonicText.trim().split(/\s+/).filter(word => word.length > 0);
    const validation = validateMnemonicWords(words);

    setMnemonicValidation({
      isValid: validation.isValid,
      totalWords: words.length,
      validCount: validation.validWords.length,
      invalidCount: validation.invalidWords.length,
      invalidWords: validation.invalidWords
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(t.mnemonicRecognized, t.mnemonicRecognizedDesc);
  };

  // Render home screen
  const renderHomeScreen = () => (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
          <Text style={styles.title}>{t.appTitle}</Text>
          <Text style={styles.subtitle}>{t.appSubtitle}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.menuButton, styles.encryptButton, isOnlineMode && styles.menuButtonDisabled]}
              onPress={() => !isOnlineMode && setCurrentScreen('encrypt')}
              disabled={isOnlineMode}
            >
              <Ionicons name="lock-closed" size={36} color="white" />
              <Text style={styles.buttonText}>{t.encrypt}</Text>
              <Text style={styles.buttonSubtext}>{t.encryptSubtext}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, styles.decryptButton, isOnlineMode && styles.menuButtonDisabled]}
              onPress={() => !isOnlineMode && setCurrentScreen('decrypt')}
              disabled={isOnlineMode}
            >
              <Ionicons name="lock-open" size={36} color="white" />
              <Text style={styles.buttonText}>{t.decrypt}</Text>
              <Text style={styles.buttonSubtext}>{t.decryptSubtext}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.menuButton, styles.strengthButton, isOnlineMode && styles.menuButtonDisabled]}
              onPress={() => !isOnlineMode && setCurrentScreen('strength')}
              disabled={isOnlineMode}
            >
              <Ionicons name="fitness" size={36} color="white" />
              <Text style={styles.buttonText}>{t.password}</Text>
              <Text style={styles.buttonSubtext}>{t.passwordSubtext}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, styles.securityButton, isOnlineMode && styles.menuButtonDisabled]}
              onPress={() => !isOnlineMode && setCurrentScreen('security')}
              disabled={isOnlineMode}
            >
              <Ionicons name="shield-checkmark-outline" size={36} color="white" />
              <Text style={styles.buttonText}>{t.security}</Text>
              <Text style={styles.buttonSubtext}>{t.securitySubtext}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.menuButton, styles.qrButton]}
              onPress={() => {
                if (isPremium) {
                  setCurrentScreen('qrcode');
                } else {
                  setShowPremiumModal(true);
                }
              }}
            >
              {!isPremium && (
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
              )}
              <Ionicons name="qr-code" size={36} color="white" />
              <Text style={styles.buttonText}>{t.qrCode}</Text>
              <Text style={styles.buttonSubtext}>{t.qrCodeSubtext}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, styles.settingsButton]}
              onPress={() => setCurrentScreen('settings')}
            >
              <Ionicons name="settings" size={36} color="white" />
              <Text style={styles.buttonText}>{t.settings}</Text>
              <Text style={styles.buttonSubtext}>{t.settingsSubtext}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>{t.version} {Constants.expoConfig?.version || '1.0.0'}</Text>
        <Text style={styles.versionSubtext}>AES-256-CBC • PBKDF2</Text>
      </View>
    </View>
  );

  // Render encrypt screen
  const renderEncryptScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t.encryptTitle}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
        <View style={styles.inputHeader}>
          <Text style={styles.label}>{t.mnemonicPhrase}</Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              if (isPremium) {
                setShowMnemonicScanner(true);
              } else {
                setShowPremiumModal(true);
              }
            }}
          >
            {!isPremium && (
              <View style={styles.smallProBadge}>
                <Text style={styles.smallProBadgeText}>PRO</Text>
              </View>
            )}
            <Ionicons name="scan" size={20} color="white" />
            <Text style={styles.scanButtonText}>{t.scan}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={t.mnemonicPlaceholder}
          placeholderTextColor="#666666"
          value={mnemonic}
          onChangeText={(text) => {
            setMnemonic(text);

            // Auto-validate as user types
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            if (words.length > 0) {
              const validation = validateMnemonicWords(words);
              setMnemonicValidation({
                isValid: validation.isValid,
                totalWords: words.length,
                validCount: validation.validWords.length,
                invalidCount: validation.invalidWords.length,
                invalidWords: validation.invalidWords
              });
            } else {
              setMnemonicValidation(null);
            }
          }}
          multiline={true}
          numberOfLines={3}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          underlineColorAndroid="transparent"
        />

        {/* Mnemonic Validation Status Bar */}
        {mnemonicValidation && (
          <View style={[
            styles.validationBar,
            mnemonicValidation.isValid ? styles.validationBarValid : styles.validationBarInvalid
          ]}>
            <Ionicons
              name={mnemonicValidation.isValid ? "checkmark-circle" : "alert-circle"}
              size={20}
              color={mnemonicValidation.isValid ? "#4CAF50" : "#F44336"}
            />
            <Text style={styles.validationText}>
              {mnemonicValidation.isValid ? t.validMnemonic : t.invalidMnemonic} {mnemonicValidation.validCount}/{mnemonicValidation.totalWords} {t.validWords}
            </Text>
          </View>
        )}

        <Text style={styles.label}>{t.password}:</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={t.enterPassword}
            placeholderTextColor="#666666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showEncryptPassword}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowEncryptPassword(!showEncryptPassword)}
          >
            <Ionicons
              name={showEncryptPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{t.confirmPassword}</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={t.confirmPasswordPlaceholder}
            placeholderTextColor="#666666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonFlex, (isEncrypting || !mnemonic || !password || !confirmPassword) && styles.actionButtonDisabled]}
            onPress={handleEncrypt}
            disabled={isEncrypting || !mnemonic || !password || !confirmPassword}
          >
            <Text style={styles.actionButtonText}>
              {isEncrypting ? t.encrypting : t.encryptButton}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clearInputButton, !(mnemonic || password || confirmPassword || encryptedResult) && styles.clearButtonDisabled]}
            onPress={clearEncryptScreen}
            disabled={!(mnemonic || password || confirmPassword || encryptedResult)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.clearInputButtonText}>{t.clear}</Text>
          </TouchableOpacity>
        </View>

        {encryptedResult ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>{t.encryptedText}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(encryptedResult)}>
              <Text style={styles.encryptedText}>{encryptedResult}</Text>
            </TouchableOpacity>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(encryptedResult)}
              >
                <Ionicons name="copy" size={20} color="white" />
                <Text style={styles.copyButtonText}>{t.copy}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.showQRButton}
                onPress={() => {
                  if (isPremium) {
                    setShowQRModal(true);
                  } else {
                    setShowPremiumModal(true);
                  }
                }}
              >
                {!isPremium && (
                  <View style={styles.smallProBadge}>
                    <Text style={styles.smallProBadgeText}>PRO</Text>
                  </View>
                )}
                <Ionicons name="qr-code" size={20} color="white" />
                <Text style={styles.showQRButtonText}>{t.showQR}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        </View>
      </ScrollView>
    </View>
  );

  // Render decrypt screen
  const renderDecryptScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t.decryptTitle}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
        <View style={styles.inputHeader}>
          <Text style={styles.label}>{t.encryptedTextLabel}</Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              if (isPremium) {
                requestCameraPermission();
              } else {
                setShowPremiumModal(true);
              }
            }}
          >
            {!isPremium && (
              <View style={styles.smallProBadge}>
                <Text style={styles.smallProBadgeText}>PRO</Text>
              </View>
            )}
            <Ionicons name="qr-code-outline" size={20} color="white" />
            <Text style={styles.scanButtonText}>{t.scanQR}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={t.encryptedTextPlaceholder}
          placeholderTextColor="#666666"
          value={encryptedInput}
          onChangeText={setEncryptedInput}
          multiline={true}
          numberOfLines={3}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          underlineColorAndroid="transparent"
        />

        <Text style={styles.label}>{t.password}:</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={t.enterYourPassword}
            placeholderTextColor="#666666"
            value={decryptPassword}
            onChangeText={setDecryptPassword}
            secureTextEntry={!showDecryptPassword}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowDecryptPassword(!showDecryptPassword)}
          >
            <Ionicons
              name={showDecryptPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonFlex, (isDecrypting || !encryptedInput || !decryptPassword) && styles.actionButtonDisabled]}
            onPress={handleDecrypt}
            disabled={isDecrypting || !encryptedInput || !decryptPassword}
          >
            <Text style={styles.actionButtonText}>
              {isDecrypting ? t.decrypting : t.decryptButton}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clearInputButton, !(encryptedInput || decryptPassword || decryptedResult) && styles.clearButtonDisabled]}
            onPress={clearDecryptScreen}
            disabled={!(encryptedInput || decryptPassword || decryptedResult)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.clearInputButtonText}>{t.clear}</Text>
          </TouchableOpacity>
        </View>

        {decryptedResult ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>{t.decryptedMnemonic}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(decryptedResult)}>
              <Text style={styles.decryptedText}>{decryptedResult}</Text>
            </TouchableOpacity>

            {/* Numbered and validated mnemonic display */}
            <View style={styles.mnemonicValidationContainer}>
              <Text style={styles.mnemonicValidationTitle}>{t.numberedPhrase}</Text>

              {/* Overall Validation Status Bar */}
              {(() => {
                const words = decryptedResult.trim().split(/\s+/).filter(word => word.length > 0);
                const validation = validateMnemonicWords(words);
                return (
                  <View style={[
                    styles.validationBar,
                    validation.isValid ? styles.validationBarValid : styles.validationBarInvalid
                  ]}>
                    <Ionicons
                      name={validation.isValid ? "checkmark-circle" : "alert-circle"}
                      size={20}
                      color={validation.isValid ? "#4CAF50" : "#F44336"}
                    />
                    <Text style={styles.validationText}>
                      {validation.isValid ? t.validMnemonic : t.invalidMnemonic} {validation.validWords.length}/{words.length} {t.validWords}
                    </Text>
                  </View>
                );
              })()}

              <ScrollView style={styles.mnemonicValidationScroll} nestedScrollEnabled={true}>
                {decryptedResult.trim().split(/\s+/).map((word, index) => {
                  const validation = validateMnemonicWords([word]);
                  const isValid = validation.isValid;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.mnemonicWordRow,
                        isValid ? styles.mnemonicWordValid : styles.mnemonicWordInvalid
                      ]}
                    >
                      <Text style={styles.mnemonicWordNumber}>{index + 1}.</Text>
                      <Text style={[
                        styles.mnemonicWord,
                        isValid ? styles.mnemonicWordTextValid : styles.mnemonicWordTextInvalid
                      ]}>
                        {word}
                      </Text>
                      <Text style={[
                        styles.mnemonicWordStatus,
                        isValid ? styles.mnemonicWordStatusValid : styles.mnemonicWordStatusInvalid
                      ]}>
                        {isValid ? '✓' : '✗'}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[styles.copyButton, { flex: 0, width: '100%', marginTop: 15 }]}
              onPress={() => copyToClipboard(decryptedResult)}
            >
              <Ionicons name="copy" size={20} color="white" />
              <Text style={styles.copyButtonText}>{t.copy}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        </View>
      </ScrollView>
    </View>
  );

  // Render password strength screen
  const renderStrengthScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t.strengthTitle}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
        <Text style={styles.label}>{t.testPassword}</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={t.testPasswordPlaceholder}
            placeholderTextColor="#666666"
            value={testPassword}
            onChangeText={setTestPassword}
            secureTextEntry={!showTestPassword}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowTestPassword(!showTestPassword)}
          >
            <Ionicons
              name={showTestPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonFlex, (isCheckingStrength || !testPassword) && styles.actionButtonDisabled]}
            onPress={handlePasswordStrength}
            disabled={isCheckingStrength || !testPassword}
          >
            <Text style={styles.actionButtonText}>
              {isCheckingStrength ? t.checking : t.checkStrength}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clearInputButton, !(testPassword || passwordStrength) && styles.clearButtonDisabled]}
            onPress={clearStrengthScreen}
            disabled={!(testPassword || passwordStrength)}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.clearInputButtonText}>{t.clear}</Text>
          </TouchableOpacity>
        </View>

        {passwordStrength ? (
          <View style={styles.strengthResult}>
            <Text style={styles.strengthTitle}>{t.passwordAnalysis}</Text>
            <Text style={styles.strengthItem}>
              {t.strength} <Text style={styles.strengthValue}>{passwordStrength.strength}</Text>
            </Text>
            <Text style={styles.strengthItem}>
              {t.entropy} <Text style={styles.strengthValue}>{passwordStrength.entropy.toFixed(1)} bits</Text>
            </Text>
            <Text style={styles.strengthItem}>
              {t.score} <Text style={styles.strengthValue}>{passwordStrength.score}/6</Text>
            </Text>

            {passwordStrength.recommendations.length > 0 ? (
              <View style={styles.recommendations}>
                <Text style={styles.recommendationsTitle}>{t.recommendations}</Text>
                {passwordStrength.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.recommendation}>• {rec}</Text>
                ))}
              </View>
            ) : (
              <Text style={styles.goodPassword}>{t.meetsRequirements}</Text>
            )}
          </View>
        ) : null}
        </View>
      </ScrollView>
    </View>
  );

  // Render security information screen
  const renderSecurityScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t.securityTitle}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.securityContent}>
        <View style={styles.backupRecommendation}>
          <View style={styles.backupHeader}>
            <Ionicons name="save" size={24} color="#2196F3" />
            <Text style={styles.backupTitle}>{t.backupTitle}</Text>
          </View>
          <View style={styles.recommendationBullets}>
            <View style={styles.bulletItem}>
              <Ionicons name="key" size={16} color="#FF9800" />
              <Text style={styles.bulletTextRed}>{t.backupDescription}<Text style={styles.bulletTextRed}>{t.backupDescriptionRed}</Text></Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="warning" size={16} color="#FF0000" />
              <Text style={styles.bulletTextRed}>{t.keepPasswordSeparate}<Text style={styles.bulletTextRed}>{t.separateAndSecure}</Text>{t.neverStoreTogether}</Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="airplane" size={16} color="#FF0000" />
              <Text style={styles.bulletTextRed}>{t.offlineDeviceRecommendation}<Text style={styles.bulletTextRed}>{t.neverConnectedRecommendation}</Text></Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="qr-code" size={16} color="#2196F3" />
              <Text style={styles.bulletTextRed}>{t.qrCodeTransfer}</Text>
            </View>
        </View>
          <View style={styles.storageSuggestionsSection}>
            <Text style={styles.storageSuggestionsTitle}>{t.encryptedTextStorageSuggestions}</Text>
            <View style={styles.recommendationBullets}>
              <View style={styles.bulletItem}>
                <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                <Text style={styles.bulletText}>{t.passwordManagers}</Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="folder" size={16} color="#2196F3" />
                <Text style={styles.bulletText}>{t.multipleLocations}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Technical Specifications Section */}
        <View style={styles.securitySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t.technicalSpecifications}</Text>
          </View>

          {/* Encryption Algorithm */}
          <View style={styles.specGroup}>
            <Text style={styles.specGroupTitle}>{t.encryptionAlgorithmDetail}</Text>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.algorithm}</Text>
              <Text style={styles.specValue}>{t.aes256cbcDetail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.compliance}</Text>
              <Text style={styles.specValue}>{t.nistFips197Detail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.keySize}</Text>
              <Text style={styles.specValue}>{t.bits256}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.blockSizeDetail}</Text>
              <Text style={styles.specValue}>{t.bits128cbc}</Text>
            </View>
          </View>

          {/* Key Derivation Function */}
          <View style={styles.specGroup}>
            <Text style={styles.specGroupTitle}>{t.keyDerivationDetail}</Text>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.kdfFunction}</Text>
              <Text style={styles.specValue}>{t.pbkdf2Detail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.rfcStandard}</Text>
              <Text style={styles.specValue}>{t.ietfRfc2898Detail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.hashFunction}</Text>
              <Text style={styles.specValue}>{t.sha256Detail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.iterationsDetail}</Text>
              <Text style={styles.specValue}>{t.iterations10k}</Text>
            </View>
          </View>

          {/* Additional Security Features */}
          <View style={styles.specGroup}>
            <Text style={styles.specGroupTitle}>{t.additionalSecurityFeatures}</Text>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.saltDetail}</Text>
              <Text style={styles.specValue}>{t.saltRandom}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.paddingDetail}</Text>
              <Text style={styles.specValue}>{t.pkcs7Detail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.encodingDetail}</Text>
              <Text style={styles.specValue}>{t.base64Detail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.storageDetail}</Text>
              <Text style={styles.specValue}>{t.noStorage}</Text>
            </View>
          </View>

          {/* Implementation Details */}
          <View style={[styles.specGroup, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <Text style={styles.specGroupTitle}>{t.implementationDetails}</Text>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.library}</Text>
              <Text style={styles.specValue}>{t.cryptojsLibrary}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.crossPlatform}</Text>
              <Text style={styles.specValue}>{t.crossPlatformDetail}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{t.verification}</Text>
              <Text style={styles.specValue}>{t.selfTest}</Text>
            </View>
          </View>
        </View>

        </View>
      </ScrollView>
    </View>
  );

  // Render settings screen
  // Render QR Code screen
  const renderQRCodeScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t.qrCodeTitle}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
        {/* Create QR Code Section */}
        <View style={styles.securitySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="qr-code-outline" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>{t.createQRCode}</Text>
          </View>
          <Text style={styles.label}>{t.enterTextForQR}</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={t.textForQRPlaceholder}
            placeholderTextColor="#666666"
            value={qrText}
            onChangeText={setQrText}
            multiline={true}
            numberOfLines={4}
            underlineColorAndroid="transparent"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonFlex, !qrText && styles.actionButtonDisabled]}
              onPress={() => {
                if (qrText) {
                  setGeneratedQRData(qrText);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
              disabled={!qrText}
            >
              <Text style={styles.actionButtonText}>{t.generateQR}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clearInputButton, !(qrText || generatedQRData) && styles.clearButtonDisabled]}
              onPress={() => {
                if (qrText || generatedQRData) {
                  setQrText('');
                  setGeneratedQRData('');
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
              disabled={!(qrText || generatedQRData)}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={styles.clearInputButtonText}>{t.clearQR}</Text>
            </TouchableOpacity>
          </View>

          {generatedQRData && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>{t.qrCodeGenerated}</Text>
              <View style={styles.qrContainer}>
                <QRCode
                  value={generatedQRData}
                  size={250}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              <Text style={styles.qrHint}>{t.saveOrShare}</Text>
            </View>
          )}
        </View>

        {/* Scan QR Code Section */}
        <View style={styles.securitySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="scan" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t.scanQRCode}</Text>
          </View>
          <Text style={styles.securityOverviewText}>{t.scanDescription}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonFlex, { backgroundColor: '#2196F3' }]}
              onPress={async () => {
                const { status} = await Camera.requestCameraPermissionsAsync();
                if (status === 'granted') {
                  setIsQRScanning(true);
                  setScannedQRData('');
                } else {
                  Alert.alert(t.cameraPermissionRequired, t.grantPermission);
                }
              }}
            >
              <Text style={styles.actionButtonText}>{t.startScanning}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clearInputButton, !scannedQRData && styles.clearButtonDisabled]}
              onPress={() => {
                if (scannedQRData) {
                  setScannedQRData('');
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
              disabled={!scannedQRData}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={styles.clearInputButtonText}>{t.clear}</Text>
            </TouchableOpacity>
          </View>

          {scannedQRData && (
            <>
              <Text style={[styles.resultLabel, { marginTop: 15 }]}>{t.scannedContent}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(scannedQRData)}>
                <Text style={styles.encryptedText}>{scannedQRData}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.copyButton, { flex: 0, width: '100%', marginTop: 0 }]}
                onPress={() => copyToClipboard(scannedQRData)}
              >
                <Ionicons name="copy" size={20} color="white" />
                <Text style={styles.copyButtonText}>{t.copy}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderQRScannerModal = () => {
    if (!isQRScanning) return null;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isQRScanning}
        onRequestClose={() => setIsQRScanning(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={({ type, data }) => {
              setScannedQRData(data);
              setIsQRScanning(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(t.qrScanSuccess, data.substring(0, 100) + (data.length > 100 ? '...' : ''));
            }}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerTopBar}>
                <TouchableOpacity onPress={() => setIsQRScanning(false)} style={styles.scannerCloseButton}>
                  <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <View style={styles.scannerTopBarContent}>
                  <Text style={styles.scannerTitle}>{t.scanQRCode}</Text>
                  <Text style={styles.scannerSubtitle}>{t.positionQrCodeInFrame}</Text>
                </View>
                <View style={styles.scannerPlaceholder} />
              </View>

              <View style={styles.scannerCenter}>
                <View style={styles.scannerFrame} />
              </View>

              <View style={styles.scannerBottomBar} />
            </View>
          </CameraView>
        </View>
      </Modal>
    );
  };

  const renderSettingsScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t.settingsTitle}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
        {/* Device Mode Section */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#FF9800" />
            <Text style={styles.sectionTitle}>{t.deviceMode}</Text>
          </View>
          <Text style={styles.settingsLabel}>{t.deviceModeDescription}</Text>

          <TouchableOpacity
            style={[styles.languageOption, !isOnlineMode && styles.languageOptionSelected]}
            onPress={() => {
              handleDeviceModeChange(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.languageOptionContent}>
              <View style={styles.languageOptionLeft}>
                <Ionicons name="airplane" size={20} color={!isOnlineMode ? '#4CAF50' : '#666'} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.languageOptionText, !isOnlineMode && styles.languageOptionTextSelected]}>
                    {t.offlineMode}
                  </Text>
                  <Text style={styles.deviceModeDesc}>{t.offlineModeDesc}</Text>
                </View>
              </View>
              {!isOnlineMode && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.languageOption, isOnlineMode && styles.languageOptionSelected]}
            onPress={() => {
              handleDeviceModeChange(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.languageOptionContent}>
              <View style={styles.languageOptionLeft}>
                <Ionicons name="wifi" size={20} color={isOnlineMode ? '#FF9800' : '#666'} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.languageOptionText, isOnlineMode && styles.languageOptionTextSelected]}>
                    {t.onlineMode}
                  </Text>
                  <Text style={styles.deviceModeDesc}>{t.onlineModeDesc}</Text>
                </View>
              </View>
              {isOnlineMode && (
                <Ionicons name="checkmark-circle" size={24} color="#FF9800" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>{t.language}</Text>
          </View>
          <Text style={styles.settingsLabel}>{t.selectLanguage}</Text>

          <TouchableOpacity
            style={[styles.languageOption, language === 'en' && styles.languageOptionSelected]}
            onPress={() => {
              setLanguage('en');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.languageOptionContent}>
              <View style={styles.languageOptionLeft}>
                <Ionicons name="globe-outline" size={20} color={language === 'en' ? '#4CAF50' : '#666'} />
              <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionTextSelected]}>
                {t.english}
              </Text>
              </View>
              {language === 'en' && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.languageOption, language === 'zh' && styles.languageOptionSelected]}
            onPress={() => {
              setLanguage('zh');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.languageOptionContent}>
              <View style={styles.languageOptionLeft}>
                <Ionicons name="globe-outline" size={20} color={language === 'zh' ? '#4CAF50' : '#666'} />
              <Text style={[styles.languageOptionText, language === 'zh' && styles.languageOptionTextSelected]}>
                {t.chinese}
              </Text>
              </View>
              {language === 'zh' && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Premium Section */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>{t.premium}</Text>
          </View>
          {isPremium ? (
            <View style={styles.premiumActiveContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <Text style={styles.premiumActiveText}>{t.premiumActive}</Text>
              <Text style={styles.premiumActiveSubtext}>{t.premiumDescription}</Text>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={restorePurchases}
              >
                <Ionicons name="refresh" size={18} color="#9C27B0" />
                <Text style={styles.restoreButtonText}>{t.restorePurchases}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.settingsLabel}>{t.premiumDescription}</Text>
              <View style={styles.premiumFeaturesList}>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="qr-code" size={20} color="#9C27B0" />
                  <Text style={styles.premiumFeatureText}>{t.qrCodeGeneration}</Text>
                </View>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="scan" size={20} color="#9C27B0" />
                  <Text style={styles.premiumFeatureText}>{t.qrCodeScanning}</Text>
                </View>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="camera" size={20} color="#9C27B0" />
                  <Text style={styles.premiumFeatureText}>{t.mnemonicRecognition}</Text>
                </View>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="phone-portrait" size={20} color="#9C27B0" />
                  <Text style={styles.premiumFeatureText}>{t.quickDeviceTransfer}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => setShowPremiumModal(true)}
              >
                <Ionicons name="star" size={20} color="white" />
                <Text style={styles.upgradeButtonText}>{t.upgradeToPremium}</Text>
              </TouchableOpacity>
              <Text style={styles.premiumPriceText}>{t.oneTimePurchase}</Text>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={restorePurchases}
              >
                <Ionicons name="refresh" size={18} color="#9C27B0" />
                <Text style={styles.restoreButtonText}>{t.restorePurchases}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        </View>
      </ScrollView>
    </View>
  );

  // Main render
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" translucent={false} />
      <View style={styles.contentContainer}>
        {currentScreen === 'home' && renderHomeScreen()}
        {currentScreen === 'encrypt' && renderEncryptScreen()}
        {currentScreen === 'decrypt' && renderDecryptScreen()}
        {currentScreen === 'strength' && renderStrengthScreen()}
        {currentScreen === 'security' && renderSecurityScreen()}
        {currentScreen === 'qrcode' && renderQRCodeScreen()}
        {currentScreen === 'settings' && renderSettingsScreen()}
      </View>

      {renderQRScannerModal()}

      {/* QR Code Display Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.qrCode}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowQRModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.qrModalLabel}>
              {t.scanQrCodeToGetText}
            </Text>

            <View style={styles.qrModalWrapper}>
              <QRCode
                value={encryptedResult}
                size={250}
                backgroundColor="white"
                color="black"
              />
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowQRModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Code Scanner Modal (for Decrypt) */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showQRScanner}
        onRequestClose={() => setShowQRScanner(false)}
      >
        <View style={styles.scannerContainer}>
          {hasPermission === null ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>{t.requestingCameraPermission}</Text>
            </View>
          ) : hasPermission === false ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>{t.noAccessToCamera}</Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
                <Text style={styles.permissionButtonText}>{t.grantPermission}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CameraView
              style={styles.camera}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={handleBarCodeScanned}
            >
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerTopBar}>
                  <TouchableOpacity onPress={() => setShowQRScanner(false)} style={styles.scannerCloseButton}>
                    <Ionicons name="close" size={28} color="white" />
                  </TouchableOpacity>
                  <View style={styles.scannerTopBarContent}>
                    <Text style={styles.scannerTitle}>{t.scanQrCode}</Text>
                    <Text style={styles.scannerSubtitle}>{t.positionQrCodeInFrame}</Text>
                  </View>
                  <View style={styles.scannerPlaceholder} />
                </View>

                <View style={styles.scannerCenter}>
                  <View style={styles.scannerFrame} />
                </View>

                <View style={styles.scannerBottomBar} />
              </View>
            </CameraView>
          )}
        </View>
      </Modal>

      {/* Premium Upgrade Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPremiumModal}
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.premiumModalContent}>
            <View style={styles.premiumModalHeader}>
              <Ionicons name="star" size={48} color="#FFD700" />
              <Text style={styles.premiumModalTitle}>{t.premiumFeature}</Text>
            </View>

            <Text style={styles.premiumModalMessage}>
              {t.premiumPromptMessage}
            </Text>

            <View style={styles.premiumModalButtons}>
              <TouchableOpacity
                style={[styles.premiumModalButton, styles.premiumModalButtonSecondary]}
                onPress={() => setShowPremiumModal(false)}
              >
                <Text style={styles.premiumModalButtonSecondaryText}>{t.maybeLater}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.premiumModalButton, styles.premiumModalButtonPrimary]}
                onPress={() => {
                  setShowPremiumModal(false);
                  // For now, just show an alert
                  // In production, this would call: purchasePremium();
                  Alert.alert(
                    t.premium,
                    'Premium purchase will be integrated with App Store/Play Store in-app purchases. For testing, you can toggle isPremium in the code.',
                    [{ text: 'OK' }]
                  );
                }}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <Text style={styles.premiumModalButtonPrimaryText}>{t.purchasing}</Text>
                ) : (
                  <>
                    <Ionicons name="star" size={20} color="white" />
                    <Text style={styles.premiumModalButtonPrimaryText}>{t.upgradeNow}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mnemonic Scanner Modal */}
      <MnemonicScanModal
        visible={showMnemonicScanner}
        onClose={() => setShowMnemonicScanner(false)}
        onMnemonicRecognized={handleMnemonicRecognized}
        translations={t}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40, // Restored padding to avoid status bar overlap
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
  },
  buttonContainer: {
    paddingHorizontal: 26,
    paddingTop: 5,
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuButton: {
    width: '47%',
    aspectRatio: 1.1,
    padding: 20,
    marginHorizontal: '1.5%',
    marginVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  encryptButton: {
    backgroundColor: '#4CAF50',
  },
  decryptButton: {
    backgroundColor: '#2196F3',
  },
  strengthButton: {
    backgroundColor: '#FF9800',
  },
  securityButton: {
    backgroundColor: '#607D8B',
  },
  qrButton: {
    backgroundColor: '#9C27B0',
  },
  proBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  proBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Small PRO badge for smaller buttons
  smallProBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
    zIndex: 10,
  },
  smallProBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  settingsButton: {
    backgroundColor: '#757575',
  },
  menuButtonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    color: 'white',
    fontSize: 13,
    opacity: 0.95,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: '#000000',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'normal',
    textAlign: 'left',
    includeFontPadding: false,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'normal',
    textAlign: 'left',
    includeFontPadding: false,
  },
  eyeButton: {
    padding: 15,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // Mnemonic validation bar styles
  validationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: -12,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  validationBarValid: {
    backgroundColor: '#E8F5E9', // Light green background
    borderLeftColor: '#4CAF50', // Green left border
  },
  validationBarInvalid: {
    backgroundColor: '#FFEBEE', // Light red background
    borderLeftColor: '#F44336', // Red left border
  },
  validationText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonFlex: {
    flex: 1,
    marginRight: 10,
  },
  actionButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  clearInputButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    minWidth: 100,
  },
  clearButtonDisabled: {
    backgroundColor: '#FFCDD2',
  },
  clearInputButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  encryptedText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  decryptedText: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontWeight: '500',
  },
  copyButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  copyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  strengthResult: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  strengthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  strengthItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  strengthValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  recommendations: {
    marginTop: 15,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginLeft: 10,
  },
  goodPassword: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 15,
  },
  showQRButton: {
    backgroundColor: '#9C27B0',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    position: 'relative',
  },
  showQRButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  qrModalLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrModalWrapper: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Premium modal styles
  premiumModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '85%',
    maxWidth: 400,
  },
  premiumModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  premiumModalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  premiumModalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  premiumModalButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumModalButtonPrimary: {
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumModalButtonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  premiumModalButtonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  premiumModalButtonSecondaryText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scannerTopBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scannerCloseButton: {
    padding: 5,
  },
  scannerTopBarContent: {
    flex: 1,
    alignItems: 'center',
  },
  scannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scannerSubtitle: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
  },
  scannerPlaceholder: {
    width: 38,
  },
  scannerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scannerBottomBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    paddingBottom: 40,
    minHeight: 80,
  },
  placeholder: {
    width: 38,
  },
  scanner: {
    flex: 1,
  },
  scannerInstructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 40,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityContent: {
    padding: 20,
  },
  securityRecommendation: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFE0E0',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginLeft: 10,
  },
  recommendationText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF0000',
  },
  recommendationBullets: {
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 5,
  },
  bulletText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  bulletTextRed: {
    fontSize: 14,
    color: '#FF0000',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  recommendationFooter: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
    textAlign: 'center',
  },
  backupRecommendation: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFB3B3',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  backupMainText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  boldTextBlue: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  boldTextOrange: {
    fontWeight: 'bold',
    color: '#F57C00',
  },
  backupSection: {
    marginBottom: 15,
  },
  securityBestPracticeSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  criticalWarningSection: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF0000',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  criticalWarningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  criticalWarningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000',
    marginLeft: 10,
  },
  criticalWarningContent: {
    fontSize: 14,
    color: '#FF0000',
    lineHeight: 20,
    fontWeight: '500',
  },
  criticalBulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FF0000',
  },
  criticalBulletText: {
    fontSize: 14,
    color: '#FF0000',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  boldTextRed: {
    fontWeight: 'bold',
    color: '#FF0000',
  },
  storageSuggestionsSection: {
    marginTop: 3,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  storageSuggestionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  backupSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  backupBullets: {
    marginLeft: 5,
  },
  backupBulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  backupBullet: {
    fontSize: 16,
    marginRight: 8,
    width: 25,
  },
  backupBulletText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  backupWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  backupWarningText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  securitySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  specItem: {
    marginBottom: 10,
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 3,
  },
  specValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  securityNote: {
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  clearAllButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  mnemonicValidationContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mnemonicValidationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
  },
  mnemonicValidationScroll: {
    maxHeight: 200,
  },
  mnemonicWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  mnemonicWordValid: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  mnemonicWordInvalid: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  mnemonicWordNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    width: 32,
  },
  mnemonicWord: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  mnemonicWordTextValid: {
    color: '#2E7D32',
  },
  mnemonicWordTextInvalid: {
    color: '#C62828',
  },
  mnemonicWordStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mnemonicWordStatusValid: {
    color: '#2E7D32',
  },
  mnemonicWordStatusInvalid: {
    color: '#C62828',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Settings screen styles
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontWeight: '500',
  },
  languageOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  languageOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 12,
  },
  languageOptionTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  deviceModeDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  // Premium section styles
  premiumActiveContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  premiumActiveText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
  },
  premiumActiveSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  premiumFeaturesList: {
    marginTop: 12,
    marginBottom: 16,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  premiumFeatureText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  upgradeButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  premiumPriceText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  restoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  restoreButtonText: {
    color: '#9C27B0',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  // Simplified security section styles
  securityOverview: {
    padding: 0,
  },
  securityOverviewText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  securityFeatures: {
    flexDirection: 'column',
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  securityFeatureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  specGroup: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  specGroupTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  // QR Code specific styles
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
  },
  qrHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  camera: {
    flex: 1,
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 8,
  },
});
