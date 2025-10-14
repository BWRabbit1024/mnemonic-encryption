/**
 * Example: How to integrate Premium Features into App.js
 *
 * This file shows example code snippets for adding premium feature checks
 * to your existing app. Copy relevant sections into App.js.
 */

// ============================================
// 1. IMPORTS (Add to top of App.js)
// ============================================

import PremiumManager, { PREMIUM_FEATURES } from './utils/PremiumManager';
import PremiumUpgrade from './components/PremiumUpgrade';

// ============================================
// 2. STATE MANAGEMENT (Add to App component)
// ============================================

const [isPremium, setIsPremium] = useState(false);
const [showUpgradeModal, setShowUpgradeModal] = useState(false);

// Initialize premium status
useEffect(() => {
  const initPremium = async () => {
    const status = await PremiumManager.hasPremium();
    setIsPremium(status);
  };
  initPremium();
}, []);

// ============================================
// 3. FEATURE LOCK CHECKS (Add to feature functions)
// ============================================

// Example: Lock QR Code Export Feature
const handleQRCodeExport = async () => {
  // Check if user has premium
  const hasAccess = await PremiumManager.hasFeature(PREMIUM_FEATURES.QR_CODE_EXPORT);

  if (!hasAccess) {
    Alert.alert(
      t.premiumRequired || 'Premium Feature',
      t.qrCodePremiumMessage || 'QR Code Export requires premium. Upgrade to unlock!',
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        {
          text: t.upgrade || 'Upgrade',
          onPress: () => setShowUpgradeModal(true)
        }
      ]
    );
    return;
  }

  // User has premium - proceed with feature
  generateQRCode(encryptedText);
};

// Example: Lock Biometric Unlock
const handleBiometricSetup = async () => {
  const hasAccess = await PremiumManager.hasFeature(PREMIUM_FEATURES.BIOMETRIC_UNLOCK);

  if (!hasAccess) {
    Alert.alert(
      'Premium Feature',
      'Biometric Unlock is a premium feature. Upgrade to unlock!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => setShowUpgradeModal(true) }
      ]
    );
    return;
  }

  // Setup biometric unlock
  setupBiometricAuth();
};

// Example: Lock Dark Mode
const handleDarkModeToggle = async () => {
  const hasAccess = await PremiumManager.hasFeature(PREMIUM_FEATURES.DARK_MODE);

  if (!hasAccess) {
    Alert.alert(
      'Premium Feature',
      'Dark Mode is a premium feature. Upgrade to unlock!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => setShowUpgradeModal(true) }
      ]
    );
    return;
  }

  // Toggle dark mode
  setDarkMode(!darkMode);
};

// ============================================
// 4. UI ELEMENTS WITH PREMIUM BADGES
// ============================================

// Example: Add premium badge to locked features
const renderFeatureButton = (icon, text, onPress, isPremiumFeature = false) => {
  return (
    <TouchableOpacity
      style={styles.featureButton}
      onPress={onPress}
    >
      <View style={styles.featureButtonContent}>
        <Ionicons name={icon} size={24} color="#2196F3" />
        <Text style={styles.featureButtonText}>{text}</Text>
        {isPremiumFeature && !isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="diamond" size={12} color="#FFD700" />
            <Text style={styles.premiumBadgeText}>PRO</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Usage in render:
{renderFeatureButton('qr-code', 'Export QR Code', handleQRCodeExport, true)}
{renderFeatureButton('finger-print', 'Biometric Unlock', handleBiometricSetup, true)}
{renderFeatureButton('moon', 'Dark Mode', handleDarkModeToggle, true)}

// ============================================
// 5. UPGRADE MODAL (Add to render/return)
// ============================================

return (
  <View style={styles.container}>
    {/* Your existing app content */}

    {/* Premium Upgrade Modal */}
    <Modal
      visible={showUpgradeModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <PremiumUpgrade
        onClose={() => setShowUpgradeModal(false)}
        onPurchaseSuccess={async () => {
          // Refresh premium status
          const status = await PremiumManager.hasPremium();
          setIsPremium(status);
        }}
      />
    </Modal>
  </View>
);

// ============================================
// 6. NAVIGATION ITEM TO UPGRADE SCREEN
// ============================================

// Add to home screen menu
const renderHomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Existing menu items */}

      {/* Premium upgrade button (only if not premium) */}
      {!isPremium && (
        <TouchableOpacity
          style={[styles.menuButton, styles.premiumButton]}
          onPress={() => setShowUpgradeModal(true)}
        >
          <View style={styles.premiumButtonContent}>
            <Ionicons name="diamond" size={32} color="#FFD700" />
            <View style={styles.premiumButtonText}>
              <Text style={styles.premiumButtonTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumButtonSubtitle}>Unlock powerful features</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>
      )}

      {/* Premium status badge (if premium) */}
      {isPremium && (
        <View style={styles.premiumStatusBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.premiumStatusText}>Premium Active</Text>
        </View>
      )}
    </ScrollView>
  );
};

// ============================================
// 7. STYLES (Add to StyleSheet.create)
// ============================================

const styles = StyleSheet.create({
  // ... existing styles ...

  // Premium button on home screen
  premiumButton: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderWidth: 2,
    borderColor: '#FFD700',
    marginVertical: 10,
  },
  premiumButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  premiumButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  premiumButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  premiumButtonSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },

  // Premium badge on feature buttons
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 2,
  },

  // Premium status badge
  premiumStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  premiumStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },

  // Feature button with premium indicator
  featureButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

// ============================================
// 8. TRANSLATIONS (Add to your translations object)
// ============================================

const translations = {
  en: {
    // ... existing translations ...
    premiumRequired: 'Premium Feature',
    upgrade: 'Upgrade',
    qrCodePremiumMessage: 'QR Code Export requires premium. Upgrade to unlock!',
    biometricPremiumMessage: 'Biometric Unlock requires premium. Upgrade to unlock!',
    darkModePremiumMessage: 'Dark Mode requires premium. Upgrade to unlock!',
    upgradeButton: 'Upgrade to Premium',
    premiumActive: 'Premium Active',
  },
  zh: {
    // ... existing translations ...
    premiumRequired: '高级功能',
    upgrade: '升级',
    qrCodePremiumMessage: '二维码导出需要高级版。升级解锁！',
    biometricPremiumMessage: '生物识别解锁需要高级版。升级解锁！',
    darkModePremiumMessage: '深色模式需要高级版。升级解锁！',
    upgradeButton: '升级到高级版',
    premiumActive: '高级版已激活',
  },
};

// ============================================
// 9. TESTING COMMANDS
// ============================================

// Add to settings/debug screen for testing
const renderDebugOptions = () => {
  return (
    <View>
      <TouchableOpacity
        style={styles.debugButton}
        onPress={async () => {
          await PremiumManager.grantPremium();
          const status = await PremiumManager.hasPremium();
          setIsPremium(status);
          Alert.alert('Debug', 'Premium granted!');
        }}
      >
        <Text>🔓 Grant Premium (Testing)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.debugButton}
        onPress={async () => {
          await PremiumManager.revokePremium();
          const status = await PremiumManager.hasPremium();
          setIsPremium(status);
          Alert.alert('Debug', 'Premium revoked!');
        }}
      >
        <Text>🔒 Revoke Premium (Testing)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => setShowUpgradeModal(true)}
      >
        <Text>💎 Show Upgrade Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// 10. COMPLETE EXAMPLE: QR CODE EXPORT FEATURE
// ============================================

// This is a complete example showing how to add a premium QR code export feature

import QRCode from 'react-native-qrcode-svg';

const [showQRCode, setShowQRCode] = useState(false);
const [qrCodeData, setQRCodeData] = useState('');

// Button to trigger QR code export
const handleExportQRCode = async () => {
  // Premium check
  const hasAccess = await PremiumManager.hasFeature(PREMIUM_FEATURES.QR_CODE_EXPORT);

  if (!hasAccess) {
    Alert.alert(
      t.premiumRequired,
      'QR Code Export is a premium feature. Upgrade to unlock!',
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.upgrade, onPress: () => setShowUpgradeModal(true) }
      ]
    );
    return;
  }

  // User has premium - show QR code
  setQRCodeData(encryptedText);
  setShowQRCode(true);
};

// QR Code modal
<Modal
  visible={showQRCode}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowQRCode(false)}
>
  <View style={styles.qrCodeModalContainer}>
    <View style={styles.qrCodeModal}>
      <Text style={styles.qrCodeTitle}>Encrypted Text QR Code</Text>
      <QRCode
        value={qrCodeData}
        size={250}
        backgroundColor="white"
      />
      <TouchableOpacity
        style={styles.qrCodeCloseButton}
        onPress={() => setShowQRCode(false)}
      >
        <Text style={styles.qrCodeCloseButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

// Styles for QR code modal
qrCodeModalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'center',
  alignItems: 'center',
},
qrCodeModal: {
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 24,
  alignItems: 'center',
},
qrCodeTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 20,
},
qrCodeCloseButton: {
  marginTop: 20,
  backgroundColor: '#2196F3',
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 8,
},
qrCodeCloseButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
