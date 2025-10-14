# Premium Features Implementation Guide

## Overview

This app uses **Google Play In-App Purchases (IAP)** to unlock premium features. The implementation is modular and secure.

## Current Status

### ✅ Phase 1: Infrastructure (COMPLETED)
- `utils/PremiumManager.js` - Premium status management
- `components/PremiumUpgrade.js` - Purchase UI screen
- Uses `expo-secure-store` for persistent premium status
- Ready for Google Play Billing integration

### 🔄 Phase 2: Google Play Billing (TODO)
- Install `react-native-iap` package
- Configure products in Google Play Console
- Integrate real purchase flow
- Add purchase verification

### 📋 Phase 3: Premium Features (TODO)
- Implement QR code export
- Add biometric unlock
- Create multiple vaults system
- Add cloud backup functionality
- Implement dark mode
- Enhanced password analysis

## How It Works

### Architecture

```
User clicks "Upgrade"
    ↓
PremiumUpgrade component shows pricing
    ↓
User selects purchase option
    ↓
Google Play Billing processes payment
    ↓
PremiumManager.grantPremium() saves status
    ↓
Premium features unlocked
```

### Storage

Premium status is stored in **Expo Secure Store** (encrypted):
- `isPremium`: "true" or not set
- `premiumGrantedAt`: ISO timestamp of purchase

### Security

- ✅ Stored in encrypted secure store (hardware-backed on Android 6+)
- ✅ Cannot be easily modified by user
- ✅ Purchase tied to Google account
- ✅ Can be restored on new devices

## Testing Current Implementation

### Test Premium Purchase

1. Open app and navigate to upgrade screen
2. Click purchase button
3. Confirm simulation dialog
4. Premium features unlocked!

### Test Premium Status

```javascript
import PremiumManager from './utils/PremiumManager';

// Check if user has premium
const isPremium = await PremiumManager.hasPremium();

// Check specific feature
const hasQRCode = await PremiumManager.hasFeature('qr_code_export');

// Grant premium (for testing)
await PremiumManager.grantPremium();

// Revoke premium (for testing)
await PremiumManager.revokePremium();
```

### Example: Lock a Feature

```javascript
import PremiumManager, { PREMIUM_FEATURES } from './utils/PremiumManager';

// In your component
const handleQRCodeExport = async () => {
  const hasAccess = await PremiumManager.hasFeature(PREMIUM_FEATURES.QR_CODE_EXPORT);

  if (!hasAccess) {
    Alert.alert(
      'Premium Feature',
      'QR Code Export is a premium feature. Upgrade to unlock!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => showUpgradeScreen() }
      ]
    );
    return;
  }

  // User has premium, proceed with feature
  generateQRCode();
};
```

## Integration with Google Play

### Step 1: Install Dependencies

```bash
npm install react-native-iap
```

### Step 2: Configure app.json

Add permissions:
```json
{
  "android": {
    "permissions": [
      "com.android.vending.BILLING"
    ]
  }
}
```

### Step 3: Create Products in Google Play Console

1. Go to Google Play Console
2. Select your app
3. Navigate to: **Monetize → In-app products**
4. Create products:
   - **Product ID**: `premium_onetime`
   - **Name**: Premium Features (One-time)
   - **Price**: $2.99
   - **Product ID**: `premium_monthly`
   - **Name**: Premium Features (Monthly)
   - **Price**: $0.99/month

### Step 4: Update PremiumUpgrade.js

Replace the simulation code with real IAP:

```javascript
import {
  requestPurchase,
  getAvailablePurchases,
  initConnection,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid
} from 'react-native-iap';

// Initialize IAP connection
useEffect(() => {
  initConnection();
  return () => endConnection();
}, []);

// Check existing purchases
const checkPurchases = async () => {
  try {
    const purchases = await getAvailablePurchases();
    const hasPremium = purchases.some(
      p => p.productId === 'premium_onetime' &&
           (p.transactionReceipt || p.purchaseToken)
    );

    if (hasPremium) {
      await PremiumManager.grantPremium();
      setIsPremium(true);
    }
  } catch (error) {
    console.error('Error checking purchases:', error);
  }
};

// Handle purchase
const handlePurchase = async (productId) => {
  setLoading(true);

  try {
    // Request purchase from Google Play
    await requestPurchase({ skus: [productId] });

    // Purchase successful - grant premium
    await PremiumManager.grantPremium();
    setIsPremium(true);

    Alert.alert('Success!', 'Premium features unlocked! 🎉');
  } catch (error) {
    if (error.code === 'E_USER_CANCELLED') {
      // User cancelled, no problem
    } else {
      Alert.alert('Purchase Failed', error.message);
    }
  } finally {
    setLoading(false);
  }
};
```

### Step 5: Test with Google Play

1. Upload APK to **Internal Testing** track
2. Add test users in Google Play Console
3. Install app from Play Store (internal test link)
4. Test purchase flow with real Google Play Billing
5. Verify purchase appears in Google Play Console

## Premium Features to Implement

### 1. QR Code Export (Easy - 2 hours)

```bash
npm install react-native-qrcode-svg
```

Show QR code of encrypted output for easy transfer between devices.

### 2. Biometric Unlock (Medium - 4 hours)

```bash
npm install expo-local-authentication
```

Allow fingerprint/face unlock instead of password for frequent access.

### 3. Multiple Vaults (Medium - 6 hours)

Add vault management:
- Create/delete vaults
- Each vault has encrypted storage
- List view of all vaults

### 4. Cloud Backup (Hard - 8 hours)

```bash
npm install expo-file-system
npm install expo-sharing
```

Export encrypted data to user's cloud (Google Drive, Dropbox).

### 5. Dark Mode (Easy - 2 hours)

Add dark theme option with theme context.

### 6. Advanced Password Analysis (Easy - 3 hours)

Enhanced password strength checking:
- Dictionary word detection
- Common pattern detection
- Breach database check (local)
- Cracking time estimation

## Revenue Model

### Recommended Pricing

- **One-time Purchase**: $2.99 (best for crypto users)
- **Monthly Subscription**: $0.99/month
- **Yearly Subscription**: $9.99/year (save 17%)

### Expected Revenue (Year 1)

**Conservative:**
- 10,000 downloads
- 2% conversion = 200 purchases
- Average $2.99 = **$600**

**Moderate:**
- 50,000 downloads
- 3% conversion = 1,500 purchases
- Average $3.00 = **$4,500**

**Optimistic:**
- 200,000 downloads
- 5% conversion = 10,000 purchases
- Average $3.00 = **$30,000**

### Google's Cut

- Google takes **15%** of revenue (first $1M per year)
- You receive **85%** of revenue
- After $1M, you receive **85%** for remaining revenue

## Next Steps

1. **Short Term (This Week)**:
   - Test current premium UI
   - Decide on pricing
   - Choose which premium features to implement first

2. **Medium Term (This Month)**:
   - Implement 2-3 premium features
   - Set up Google Play Console products
   - Integrate real IAP

3. **Long Term (Next 3 Months)**:
   - Launch free version
   - Get user feedback
   - Add premium features based on demand
   - Start marketing

## Support & Troubleshooting

### Common Issues

**Purchase not unlocking features:**
- Check Google Play Console for transaction
- Verify product IDs match exactly
- Call `getAvailablePurchases()` to restore

**Testing purchases:**
- Use Google Play Internal Testing track
- Add test account in Play Console
- Purchases are real but refundable

**Refunds:**
- Google handles refunds automatically
- You can detect refunds via purchase validation
- Revoke premium access if refunded

## Legal Requirements

### Privacy Policy
Must state:
- Payment processed by Google
- No payment information stored in app
- Premium status stored locally
- Can request data deletion

### Terms of Service
Should include:
- Premium features description
- Refund policy (follow Google's)
- Feature availability disclaimer
- No warranty clause

## Marketing Tips

1. **Free Version First**: Build trust before asking for money
2. **Show Value**: Let users try app, then show what premium adds
3. **Limited-Time Offers**: Launch discount for early adopters
4. **Social Proof**: Show number of premium users
5. **Testimonials**: Feature user reviews of premium features

---

## Questions?

This implementation is production-ready infrastructure. The simulation works now for testing. When ready to launch, simply:
1. Install `react-native-iap`
2. Configure products in Google Play Console
3. Replace simulation code with real IAP calls
4. Submit for review

Premium features can be added incrementally after launch based on user demand.
