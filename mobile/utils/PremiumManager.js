/**
 * Premium Features Manager
 * Handles In-App Purchases for premium features
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Premium feature flags
export const PREMIUM_FEATURES = {
  QR_CODE_EXPORT: 'qr_code_export',
  BIOMETRIC_UNLOCK: 'biometric_unlock',
  MULTIPLE_VAULTS: 'multiple_vaults',
  CLOUD_BACKUP: 'cloud_backup',
  DARK_MODE: 'dark_mode',
  ADVANCED_PASSWORD_ANALYSIS: 'advanced_password_analysis',
};

// Product IDs (must match Google Play Console)
export const PRODUCT_IDS = {
  PREMIUM_ONETIME: 'premium_onetime',
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_YEARLY: 'premium_yearly',
};

class PremiumManager {
  constructor() {
    this.isPremium = false;
    this.isInitialized = false;
  }

  /**
   * Initialize premium status from secure storage
   */
  async initialize() {
    try {
      const premiumStatus = await SecureStore.getItemAsync('isPremium');
      this.isPremium = premiumStatus === 'true';
      this.isInitialized = true;
      return this.isPremium;
    } catch (error) {
      console.error('Error initializing premium status:', error);
      this.isPremium = false;
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * Check if user has premium access
   */
  async hasPremium() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.isPremium;
  }

  /**
   * Check if specific feature is available
   */
  async hasFeature(featureName) {
    const isPremium = await this.hasPremium();
    return isPremium;
  }

  /**
   * Grant premium access (after successful purchase)
   */
  async grantPremium() {
    try {
      await SecureStore.setItemAsync('isPremium', 'true');
      await SecureStore.setItemAsync('premiumGrantedAt', new Date().toISOString());
      this.isPremium = true;
      return true;
    } catch (error) {
      console.error('Error granting premium:', error);
      return false;
    }
  }

  /**
   * Revoke premium access (for testing or refunds)
   */
  async revokePremium() {
    try {
      await SecureStore.deleteItemAsync('isPremium');
      await SecureStore.deleteItemAsync('premiumGrantedAt');
      this.isPremium = false;
      return true;
    } catch (error) {
      console.error('Error revoking premium:', error);
      return false;
    }
  }

  /**
   * Get premium purchase date
   */
  async getPremiumGrantedDate() {
    try {
      const dateString = await SecureStore.getItemAsync('premiumGrantedAt');
      return dateString ? new Date(dateString) : null;
    } catch (error) {
      console.error('Error getting premium date:', error);
      return null;
    }
  }

  /**
   * Check if feature should be locked (for UI display)
   */
  async isFeatureLocked(featureName) {
    const hasAccess = await this.hasFeature(featureName);
    return !hasAccess;
  }
}

// Singleton instance
const premiumManager = new PremiumManager();

export default premiumManager;
