/**
 * Authentication Screen - PIN & Fingerprint Lock
 * Supports 6-digit PIN and biometric authentication
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Adaptive scaling based on screen height (reference: 800px)
const scale = SCREEN_HEIGHT / 800;
const hp = (percentage) => (SCREEN_HEIGHT * percentage) / 100; // height percentage
const sp = (size) => Math.round(size * scale); // scaled size

export default function AuthenticationScreen({ onAuthenticated, onCancel, mode = 'verify', storedPin = null, disableBiometric = false, t }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(mode === 'setup' ? 'enter' : 'verify');
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Sync step state when mode prop changes (for Change PIN flow)
  useEffect(() => {
    const newStep = mode === 'setup' ? 'enter' : 'verify';
    setStep(newStep);
    setPin('');
    setConfirmPin('');
  }, [mode]);

  useEffect(() => {
    checkBiometricAvailability();
    if (mode === 'verify' && !disableBiometric) {
      // Auto-prompt for biometric on verify mode (unless disabled)
      attemptBiometricAuth();
    }
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const attemptBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t?.unlockMnemonicEncryption || 'Unlock Mnemonic Encryption',
        fallbackLabel: t?.usePin || 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onAuthenticated();
      }
    } catch (error) {
      console.log('Biometric auth error:', error);
    }
  };

  const handleNumberPress = (number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === 'enter') {
      if (pin.length < 6) {
        const newPin = pin + number;
        setPin(newPin);

        // Auto-advance to confirmation when 6 digits are entered
        if (newPin.length === 6) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => {
            setStep('confirm');
          }, 200); // Small delay for better UX
        }
      }
    } else if (step === 'confirm') {
      if (confirmPin.length < 6) {
        const newConfirmPin = confirmPin + number;
        setConfirmPin(newConfirmPin);

        // Check when 6 digits are entered
        if (newConfirmPin.length === 6) {
          if (newConfirmPin === pin) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onAuthenticated(pin); // Pass PIN to parent
          } else {
            // PINs don't match
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            shakeError();
            setTimeout(() => {
              setPin('');
              setConfirmPin('');
              setStep('enter');
              Alert.alert(t?.error || 'Error', t?.pinsDoNotMatch || 'PINs do not match. Please try again.');
            }, 500);
          }
        }
      }
    } else if (step === 'verify') {
      if (pin.length < 6) {
        const newPin = pin + number;
        setPin(newPin);

        // Auto-verify when 6 digits are entered
        if (newPin.length === 6) {
          verifyPin(newPin);
        }
      }
    }
  };

  const verifyPin = (pinToVerify) => {
    if (mode === 'verify' && storedPin) {
      if (pinToVerify === storedPin) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onAuthenticated();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        shakeError();
        setTimeout(() => {
          setPin('');
        }, 500);
      }
    } else {
      // In setup mode, just pass the PIN to parent
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onAuthenticated(pinToVerify);
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (step === 'enter') {
      setPin(pin.slice(0, -1));
    } else if (step === 'confirm') {
      setConfirmPin(confirmPin.slice(0, -1));
    } else if (step === 'verify') {
      setPin(pin.slice(0, -1));
    }
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const renderPinDots = () => {
    const currentPin = step === 'confirm' ? confirmPin : pin;
    return (
      <Animated.View
        style={[
          styles.pinDotsContainer,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              currentPin.length > index && styles.pinDotFilled
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'delete']
    ];

    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, colIndex) => {
              if (item === '') {
                return <View key={colIndex} style={{ width: sp(70), marginHorizontal: sp(7) }} />;
              }

              if (item === 'delete') {
                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={styles.numberButton}
                    onPress={handleDelete}
                  >
                    <Ionicons name="backspace-outline" size={sp(25)} color="#000000" />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(item)}
                >
                  <Text style={styles.numberText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const getTitle = () => {
    if (mode === 'setup') {
      return step === 'enter' ? (t?.createNewPin || 'Create New PIN') : (t?.confirmNewPin || 'Confirm New PIN');
    }
    // In verify mode, check if we're changing PIN (disableBiometric = true)
    if (disableBiometric) {
      return t?.verifyCurrentPin || 'Verify Current PIN';
    }
    return t?.enterPin || 'Enter PIN';
  };

  const getSubtitle = () => {
    if (mode === 'setup') {
      return step === 'enter'
        ? (t?.enterSixDigitPin || 'Enter a 6-digit PIN to secure your app')
        : (t?.enterNewPinAgain || 'Enter your new PIN again to confirm');
    }
    // In verify mode, check if we're changing PIN (disableBiometric = true)
    if (disableBiometric) {
      return t?.enterCurrentPinToVerify || 'Enter your current PIN to verify';
    }
    return t?.enterPinToUnlock || 'Enter your PIN to unlock the app';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={sp(42)} color="#007AFF" />
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.middleSection}>
          {renderPinDots()}
          {renderNumberPad()}
        </View>

        <View style={styles.bottomSection}>
          {mode === 'verify' && biometricAvailable && !disableBiometric && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={attemptBiometricAuth}
            >
              <Ionicons name="finger-print" size={sp(26)} color="#007AFF" />
              <Text style={styles.biometricText}>{t?.useFingerprint || 'Use Fingerprint'}</Text>
            </TouchableOpacity>
          )}

          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{t?.cancel || 'Cancel'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: hp(1.5),
  },
  middleSection: {
    alignItems: 'center',
    marginTop: hp(3),
  },
  bottomSection: {
    paddingBottom: hp(2),
  },
  title: {
    fontSize: sp(24),
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: hp(1.5),
  },
  subtitle: {
    fontSize: sp(14),
    color: '#8E8E93',
    marginTop: hp(1),
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: sp(18),
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3.5),
  },
  pinDot: {
    width: sp(13),
    height: sp(13),
    borderRadius: sp(6.5),
    marginHorizontal: sp(7),
    backgroundColor: '#E5E5EA',
  },
  pinDotFilled: {
    backgroundColor: '#007AFF',
  },
  numberPad: {
    alignSelf: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  numberButton: {
    width: sp(70),
    height: sp(70),
    borderRadius: sp(35),
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: sp(7),
  },
  numberText: {
    fontSize: sp(26),
    fontWeight: '300',
    color: '#000000',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    marginHorizontal: 48,
  },
  biometricText: {
    fontSize: sp(16),
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '400',
  },
  cancelButton: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  cancelText: {
    fontSize: sp(16),
    color: '#007AFF',
    fontWeight: '400',
  },
});
