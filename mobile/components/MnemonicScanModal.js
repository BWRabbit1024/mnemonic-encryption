/**
 * Mnemonic Scan Modal Component
 * Scans and recognizes BIP39 mnemonic phrases from images using OCR
 */

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { Ionicons } from '@expo/vector-icons';
import { validateMnemonicWords, isValidMnemonicLength, findClosestWord } from '../utils/bip39';

export default function MnemonicScanModal({ visible, onClose, onMnemonicRecognized, translations }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mnemonicWords, setMnemonicWords] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const cameraRef = useRef(null);

  // Parse mnemonic from recognized text
  const parseMnemonicFromText = (text) => {
    const lines = text.split('\n');
    const wordMap = new Map();

    // Pattern to match numbered items: "1. word" or "1 word" or "1) word"
    const numberedPattern = /^(\d+)[\.\)\s]+(\w+)/;

    // First try to find numbered words
    lines.forEach(line => {
      const match = line.trim().match(numberedPattern);
      if (match) {
        const index = parseInt(match[1]);
        const word = match[2].toLowerCase().trim();
        if (index > 0 && index <= 24) {
          wordMap.set(index, word);
        }
      }
    });

    // If no numbered words found, try to extract plain words
    if (wordMap.size === 0) {
      const allText = text.toLowerCase();
      // Extract all words (letters only, 3+ characters)
      const words = allText.match(/\b[a-z]{3,}\b/g);

      if (words) {
        words.forEach((word, idx) => {
          // Only take first 24 words
          if (idx < 24) {
            wordMap.set(idx + 1, word.trim());
          }
        });
      }
    }

    // Convert map to sorted array
    const result = [];
    const sortedIndices = Array.from(wordMap.keys()).sort((a, b) => a - b);

    sortedIndices.forEach(index => {
      const word = wordMap.get(index);
      const validation = validateMnemonicWords([word]);
      const isValid = validation.isValid;
      const suggestion = isValid ? undefined : findClosestWord(word);

      result.push({
        index,
        word,
        isValid,
        suggestion,
      });
    });

    return result;
  };

  // Process image with OCR
  const processImage = async (uri) => {
    try {
      // Recognize text with ML Kit
      const result = await TextRecognition.recognize(uri);
      const parsedWords = parseMnemonicFromText(result.text);

      if (parsedWords.length === 0) {
        Alert.alert(
          translations.noMnemonicPhrasesFoundAlert,
          translations.couldNotFindMnemonicPhrases
        );
        return;
      }

      const validCount = parsedWords.filter(w => w.isValid).length;
      const totalCount = parsedWords.length;
      const isValidLength = isValidMnemonicLength(totalCount);

      setMnemonicWords(parsedWords);
      setShowCamera(false);

      // Show summary alert
      if (validCount === totalCount && isValidLength) {
        Alert.alert(
          translations.validMnemonicPhrase,
          translations.foundValidBip39Words.replace('{count}', totalCount)
        );
      } else if (!isValidLength) {
        Alert.alert(
          translations.invalidLengthAlert,
          translations.foundWordsInvalidLength.replace('{count}', totalCount)
        );
      } else {
        Alert.alert(
          translations.validationIssues,
          translations.foundValidWords.replace('{valid}', validCount).replace('{total}', totalCount)
        );
      }
    } catch (error) {
      console.error('Error recognizing text:', error);
      Alert.alert(translations.encryptionError, translations.errorRecognizingText);
    }
  };

  // Capture photo with camera
  const captureAndRecognize = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (photo?.uri) {
        await processImage(photo.uri);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert(translations.encryptionError, translations.errorCapturingPhoto);
    } finally {
      setIsProcessing(false);
    }
  };

  // Pick image from gallery
  const pickImageAndRecognize = async () => {
    if (isProcessing) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        setIsProcessing(true);
        await processImage(result.assets[0].uri);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(translations.encryptionError, translations.errorPickingImage);
      setIsProcessing(false);
    }
  };

  // Reset to camera view
  const resetCamera = () => {
    setMnemonicWords([]);
    setShowCamera(true);
  };

  // Add mnemonic to encrypt screen
  const handleAddMnemonic = () => {
    const mnemonicText = mnemonicWords.map(w => w.word).join(' ');
    onMnemonicRecognized(mnemonicText);
    handleClose();
  };

  // Close modal and reset state
  const handleClose = () => {
    setMnemonicWords([]);
    setShowCamera(true);
    onClose();
  };

  // Calculate validation status
  const validCount = mnemonicWords.filter(w => w.isValid).length;
  const totalCount = mnemonicWords.length;
  const isValidLength = isValidMnemonicLength(totalCount);
  const allValid = validCount === totalCount && isValidLength;

  // Render camera permission request
  if (!permission || !permission.granted) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={handleClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{translations.scanMnemonic}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.permissionContainer}>
            <Ionicons name="camera-outline" size={64} color="#666" />
            <Text style={styles.permissionText}>{translations.cameraPermissionRequiredForScan}</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>{translations.grantPermission}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {showCamera ? (
          <>
            {/* Camera View */}
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
            >
              <View style={styles.overlay}>
                <View style={styles.topBar}>
                  <TouchableOpacity onPress={handleClose} style={styles.cameraCloseButton}>
                    <Ionicons name="close" size={28} color="white" />
                  </TouchableOpacity>
                  <View style={styles.topBarContent}>
                    <Text style={styles.title}>{translations.scanMnemonicPhrase}</Text>
                    <Text style={styles.subtitle}>{translations.scanMnemonicPhrasesWithOrWithoutNumbers}</Text>
                    <Text style={styles.offlineNote}>{translations.offlineBip39Validation}</Text>
                  </View>
                  <View style={styles.placeholder} />
                </View>

                <View style={styles.bottomBar}>
                  {isProcessing ? (
                    <View style={styles.processingContainer}>
                      <ActivityIndicator size="large" color="#FF9800" />
                      <Text style={styles.processingText}>{translations.processing}</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.captureButton, styles.galleryButton]}
                        onPress={pickImageAndRecognize}
                      >
                        <Ionicons name="images" size={24} color="white" />
                        <Text style={styles.captureButtonText}>{translations.gallery}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.captureButton}
                        onPress={captureAndRecognize}
                      >
                        <Ionicons name="camera" size={24} color="white" />
                        <Text style={styles.captureButtonText}>{translations.capture}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </CameraView>
          </>
        ) : (
          <>
            {/* Results View */}
            <View style={styles.resultsContainer}>
              <View style={[styles.resultHeader, allValid ? styles.resultHeaderValid : styles.resultHeaderInvalid]}>
                <TouchableOpacity onPress={handleClose} style={styles.resultCloseButton}>
                  <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <View style={styles.resultHeaderContent}>
                  <Text style={styles.resultTitle}>
                    {allValid ? translations.validMnemonic : translations.checkRequired}
                  </Text>
                  <Text style={styles.resultSubtitle}>
                    {validCount}/{totalCount} {translations.validWords}
                    {!isValidLength && ` • ${translations.invalidLength}`}
                  </Text>
                </View>
                <View style={styles.placeholder} />
              </View>

              <ScrollView
                style={styles.textContainer}
                contentContainerStyle={styles.scrollContent}
              >
                {mnemonicWords.length > 0 ? (
                  <View style={styles.wordGrid}>
                    {mnemonicWords.map((item) => (
                      <View
                        key={item.index}
                        style={[
                          styles.wordItem,
                          item.isValid ? styles.wordItemValid : styles.wordItemInvalid
                        ]}
                      >
                        <Text style={styles.wordIndex}>{item.index}.</Text>
                        <View style={styles.wordContent}>
                          <Text
                            style={[
                              styles.wordText,
                              item.isValid ? styles.wordTextValid : styles.wordTextInvalid
                            ]}
                          >
                            {item.word}
                          </Text>
                          {!item.isValid && item.suggestion && (
                            <Text style={styles.suggestionText}>
                              Suggestion: {item.suggestion}
                            </Text>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.wordStatus,
                            item.isValid ? styles.wordStatusValid : styles.wordStatusInvalid
                          ]}
                        >
                          {item.isValid ? '✓' : '✗'}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noTextFound}>{translations.noMnemonicPhrasesFound}</Text>
                )}
              </ScrollView>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rescanButton]}
                  onPress={resetCamera}
                >
                  <Ionicons name="camera" size={20} color="white" />
                  <Text style={styles.actionButtonText}>{translations.scanAgain}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.addButton,
                    !allValid && styles.addButtonDisabled
                  ]}
                  onPress={handleAddMnemonic}
                  disabled={!allValid}
                >
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.actionButtonText}>
                    {allValid ? translations.addToEncrypt : translations.fixErrorsFirst}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  placeholder: {
    width: 38,
  },
  topBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cameraCloseButton: {
    padding: 5,
  },
  topBarContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
  },
  offlineNote: {
    color: '#FF9800',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  bottomBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    minWidth: 130,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  galleryButton: {
    backgroundColor: '#2196F3',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultHeaderValid: {
    backgroundColor: '#4CAF50',
  },
  resultHeaderInvalid: {
    backgroundColor: '#FF5722',
  },
  resultCloseButton: {
    padding: 5,
  },
  resultHeaderContent: {
    flex: 1,
    alignItems: 'center',
  },
  resultTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultSubtitle: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
  },
  textContainer: {
    flex: 1,
    padding: 15,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  wordGrid: {
    gap: 6,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  wordItemValid: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  wordItemInvalid: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  wordIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    width: 36,
  },
  wordContent: {
    flex: 1,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
  },
  wordTextValid: {
    color: '#2E7D32',
  },
  wordTextInvalid: {
    color: '#C62828',
  },
  suggestionText: {
    fontSize: 12,
    color: '#FF6F00',
    marginTop: 3,
  },
  wordStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  wordStatusValid: {
    color: '#2E7D32',
  },
  wordStatusInvalid: {
    color: '#C62828',
  },
  noTextFound: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  rescanButton: {
    backgroundColor: '#FF9800',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  addButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
