/**
 * Premium Upgrade Screen
 * Displays premium features and handles purchase flow
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PremiumManager from '../utils/PremiumManager';

export default function PremiumUpgrade({ onClose, onPurchaseSuccess }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    setChecking(true);
    const status = await PremiumManager.hasPremium();
    setIsPremium(status);
    setChecking(false);
  };

  // For testing: simulate purchase
  const handlePurchase = async (productId) => {
    setLoading(true);

    try {
      // TODO: Replace with actual In-App Purchase implementation
      // This is a simulation for development/testing
      Alert.alert(
        'Purchase Simulation',
        'In production, this will use Google Play Billing.\n\nSimulate successful purchase?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setLoading(false),
          },
          {
            text: 'Yes, Simulate Purchase',
            onPress: async () => {
              // Simulate network delay
              await new Promise(resolve => setTimeout(resolve, 1500));

              // Grant premium access
              const success = await PremiumManager.grantPremium();

              if (success) {
                setIsPremium(true);
                Alert.alert(
                  'Success!',
                  'Premium features unlocked! 🎉',
                  [{ text: 'OK', onPress: () => {
                    onPurchaseSuccess?.();
                    onClose?.();
                  }}]
                );
              } else {
                Alert.alert('Error', 'Failed to unlock premium features.');
              }

              setLoading(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Failed', error.message);
      setLoading(false);
    }
  };

  // For testing: restore premium
  const handleRestore = async () => {
    setLoading(true);

    try {
      // In production, this would check with Google Play
      const hasPremium = await PremiumManager.hasPremium();

      if (hasPremium) {
        Alert.alert('Already Premium', 'You already have premium access!');
        setIsPremium(true);
      } else {
        Alert.alert('No Purchase Found', 'No previous purchase found for this account.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchase.');
    }

    setLoading(false);
  };

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.premiumBadge}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.premiumTitle}>Premium Active</Text>
            <Text style={styles.premiumSubtitle}>All features unlocked!</Text>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Your Premium Features:</Text>
            {renderFeature('qr-code', 'QR Code Export', 'Generate QR codes for encrypted output')}
            {renderFeature('finger-print', 'Biometric Unlock', 'Use fingerprint or face unlock')}
            {renderFeature('folder-open', 'Multiple Vaults', 'Organize encrypted data in vaults')}
            {renderFeature('cloud-upload', 'Cloud Backup', 'Backup to your own cloud storage')}
            {renderFeature('moon', 'Dark Mode', 'Easy on the eyes')}
            {renderFeature('analytics', 'Advanced Analysis', 'Detailed password strength analysis')}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Ionicons name="diamond" size={64} color="#FFD700" />
          <Text style={styles.heroTitle}>Upgrade to Premium</Text>
          <Text style={styles.heroSubtitle}>Unlock powerful features for enhanced security</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Premium Features:</Text>
          {renderFeature('qr-code', 'QR Code Export', 'Generate QR codes for encrypted output')}
          {renderFeature('finger-print', 'Biometric Unlock', 'Use fingerprint or face unlock')}
          {renderFeature('folder-open', 'Multiple Vaults', 'Organize encrypted data in vaults')}
          {renderFeature('cloud-upload', 'Cloud Backup', 'Backup to your own cloud storage')}
          {renderFeature('moon', 'Dark Mode', 'Easy on the eyes')}
          {renderFeature('analytics', 'Advanced Analysis', 'Detailed password strength analysis')}
        </View>

        <View style={styles.pricingContainer}>
          <TouchableOpacity
            style={[styles.purchaseButton, styles.recommendedButton]}
            onPress={() => handlePurchase('premium_onetime')}
            disabled={loading}
          >
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedBadgeText}>BEST VALUE</Text>
            </View>
            <Text style={styles.purchaseButtonTitle}>One-Time Purchase</Text>
            <Text style={styles.purchaseButtonPrice}>$2.99</Text>
            <Text style={styles.purchaseButtonSubtitle}>Pay once, yours forever</Text>
            {loading && <ActivityIndicator color="#FFF" style={{ marginTop: 10 }} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={() => handlePurchase('premium_monthly')}
            disabled={loading}
          >
            <Text style={styles.purchaseButtonTitle}>Monthly</Text>
            <Text style={styles.purchaseButtonPrice}>$0.99/month</Text>
            <Text style={styles.purchaseButtonSubtitle}>Cancel anytime</Text>
            {loading && <ActivityIndicator color="#FFF" style={{ marginTop: 10 }} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={loading}
        >
          <Text style={styles.restoreButtonText}>Restore Purchase</Text>
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
          <Text style={styles.securityNoteText}>
            Secure payment through Google Play. Core encryption features remain free forever.
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  function renderFeature(iconName, title, description) {
    return (
      <View style={styles.featureItem}>
        <View style={styles.featureIcon}>
          <Ionicons name={iconName} size={24} color="#2196F3" />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </View>
        <Ionicons name="checkmark-circle" size={24} color={isPremium ? "#4CAF50" : "#CCC"} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  premiumBadge: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  featuresContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
  },
  pricingContainer: {
    marginBottom: 20,
  },
  purchaseButton: {
    backgroundColor: '#2196F3',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'visible',
  },
  recommendedButton: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  purchaseButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  purchaseButtonPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  purchaseButtonSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    marginLeft: 10,
    lineHeight: 18,
  },
});
