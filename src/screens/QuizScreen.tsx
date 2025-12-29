import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { usePassages } from '../context/PassagesContext';
import { useTheme } from '../context/ThemeContext';
import { BlankInput, BlankInputRef } from '../components/BlankInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

// Generate random blank indices for a given kelvin
const generateBlankIndices = (wordCount: number, kelvin: number): number[] => {
  const allIndices = Array.from({ length: wordCount }, (_, i) => i);
  const shuffled = [...allIndices].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, kelvin).sort((a, b) => a - b);
};

export const QuizScreen = ({ navigation, route }: Props) => {
  const { passageId } = route.params;
  const { getPassage, isComplete, setKelvin, deletePassage } = usePassages();
  const { colors, isDark, toggleTheme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [testAtKVisible, setTestAtKVisible] = useState(false);
  const [testAtKValue, setTestAtKValue] = useState('');
  const [blankIndices, setBlankIndices] = useState<number[]>([]);
  const [quizKey, setQuizKey] = useState(0); // Used to force re-render after submit

  const passage = getPassage(passageId);
  const inputRefs = useRef<Map<number, BlankInputRef>>(new Map());

  const words = useMemo(() =>
    passage ? passage.text.split(/\s+/).filter(w => w.length > 0) : [],
    [passage?.text]
  );

  const kelvin = passage?.kelvin ?? 0;
  const complete = passage ? isComplete(passage) : false;

  // Generate new random blanks when kelvin changes or quiz is submitted
  useEffect(() => {
    if (words.length > 0 && kelvin > 0) {
      setBlankIndices(generateBlankIndices(words.length, kelvin));
    } else {
      setBlankIndices([]);
    }
  }, [kelvin, words.length, quizKey]);

  useEffect(() => {
    if (!passage) {
      navigation.goBack();
    }
  }, [passage, navigation]);

  if (!passage) return null;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingTop: 48,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    backButtonText: {
      fontSize: 24,
      color: colors.text,
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontFamily: 'serif',
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    kelvinText: {
      fontFamily: 'serif',
      fontSize: 14,
      color: complete ? colors.correct : colors.textSecondary,
      marginTop: 2,
    },
    menuButton: {
      padding: 8,
    },
    menuButtonText: {
      fontSize: 24,
      color: colors.text,
    },
    scroll: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 100,
    },
    textContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'baseline',
    },
    word: {
      fontFamily: 'serif',
      fontSize: 18,
      lineHeight: 36,
      color: colors.text,
      marginHorizontal: 2,
    },
    completeMessage: {
      fontFamily: 'serif',
      fontSize: 20,
      fontWeight: '600',
      color: colors.correct,
      textAlign: 'center',
      marginTop: 32,
    },
    submitButton: {
      position: 'absolute',
      bottom: 32,
      left: 32,
      right: 32,
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    submitButtonText: {
      fontFamily: 'serif',
      fontSize: 18,
      fontWeight: '600',
      color: colors.surface,
    },
    menu: {
      position: 'absolute',
      top: 50,
      right: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 100,
    },
    menuItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemText: {
      fontFamily: 'serif',
      fontSize: 16,
      color: colors.text,
    },
    menuItemTextDanger: {
      color: colors.incorrect,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      width: 280,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontFamily: 'serif',
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    modalSubtitle: {
      fontFamily: 'serif',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    modalInput: {
      fontFamily: 'serif',
      fontSize: 18,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalButtonCancel: {
      backgroundColor: colors.inputBackground,
      marginRight: 8,
    },
    modalButtonConfirm: {
      backgroundColor: colors.primary,
      marginLeft: 8,
    },
    modalButtonText: {
      fontFamily: 'serif',
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    modalButtonTextConfirm: {
      color: colors.surface,
    },
  });

  const handleSubmit = useCallback(() => {
    let correct = 0;
    let incorrect = 0;

    // Grade all blanks
    blankIndices.forEach(wordIndex => {
      const inputRef = inputRefs.current.get(wordIndex);
      if (inputRef) {
        const result = inputRef.getResult();
        if (result.isCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    // Calculate new kelvin: current - correct + incorrect
    const delta = correct - incorrect;
    const newKelvin = Math.max(0, Math.min(words.length, kelvin - delta));

    // Show results
    const message = delta > 0
      ? `+${correct} correct, -${incorrect} wrong\nNet: ${delta > 0 ? '-' : '+'}${Math.abs(delta)}K`
      : delta < 0
        ? `+${correct} correct, -${incorrect} wrong\nNet: +${Math.abs(delta)}K`
        : `+${correct} correct, -${incorrect} wrong\nNo change`;

    Alert.alert(
      newKelvin === 0 ? 'Memorized!' : `${newKelvin}K`,
      message,
      [{
        text: 'Continue',
        onPress: () => {
          setKelvin(passageId, newKelvin);
          setQuizKey(k => k + 1); // Force new blanks
        }
      }]
    );
  }, [blankIndices, kelvin, words.length, passageId, setKelvin]);

  const handleSpace = useCallback((currentBlankPosition: number) => {
    // Focus the next blank input
    if (currentBlankPosition < blankIndices.length - 1) {
      const nextBlankWordIndex = blankIndices[currentBlankPosition + 1];
      const nextInput = inputRefs.current.get(nextBlankWordIndex);
      if (nextInput) {
        setTimeout(() => nextInput.focus(), 50);
      }
    }
  }, [blankIndices]);

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate('Edit', { passageId });
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Passage',
      'Are you sure you want to delete this passage? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePassage(passageId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleToggleTheme = () => {
    setMenuVisible(false);
    toggleTheme();
  };

  const handleResetProgress = () => {
    setMenuVisible(false);
    Alert.alert(
      'Reset Progress',
      'This will reset to full Kelvin (all words as blanks). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            setKelvin(passageId, words.length);
            setQuizKey(k => k + 1);
          },
        },
      ]
    );
  };

  const handleTestAtK = () => {
    setMenuVisible(false);
    setTestAtKValue(String(kelvin));
    setTestAtKVisible(true);
  };

  const handleTestAtKSubmit = () => {
    const targetK = parseInt(testAtKValue, 10);

    if (isNaN(targetK) || targetK < 0 || targetK > words.length) {
      Alert.alert('Invalid', `Please enter a number between 0 and ${words.length}`);
      return;
    }

    setKelvin(passageId, targetK);
    setQuizKey(k => k + 1);
    setTestAtKVisible(false);
  };

  const getWordWidth = (word: string) => {
    // Rough estimate: 10px per character
    return Math.max(word.length * 10, 40);
  };

  let blankPosition = 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{passage.title}</Text>
          <Text style={styles.kelvinText}>
            {complete ? 'Memorized!' : `${kelvin}K remaining`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleToggleTheme}>
              <Text style={styles.menuItemText}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Text style={styles.menuItemText}>Edit Passage</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleTestAtK}>
              <Text style={styles.menuItemText}>Test at K...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleResetProgress}>
              <Text style={styles.menuItemText}>Reset Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={handleDelete}>
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                Delete Passage
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.textContainer}>
          {words.map((word, index) => {
            const isBlank = blankIndices.includes(index);

            if (isBlank) {
              const currentPosition = blankPosition;
              blankPosition++;

              return (
                <BlankInput
                  key={`${quizKey}-${index}`}
                  ref={(ref) => {
                    if (ref) {
                      inputRefs.current.set(index, ref);
                    } else {
                      inputRefs.current.delete(index);
                    }
                  }}
                  expectedWord={word}
                  caseSensitive={passage.caseSensitive}
                  exactPunctuation={passage.exactPunctuation}
                  onSpace={() => handleSpace(currentPosition)}
                  width={getWordWidth(word)}
                />
              );
            }

            return (
              <Text key={index} style={styles.word}>
                {word}
              </Text>
            );
          })}
        </View>

        {complete && (
          <Text style={styles.completeMessage}>
            Congratulations! You've memorized this passage.
          </Text>
        )}
      </ScrollView>

      {!complete && blankIndices.length > 0 && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={testAtKVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTestAtKVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Test at K</Text>
            <Text style={styles.modalSubtitle}>
              Enter target Kelvin (0-{words.length})
            </Text>
            <TextInput
              style={styles.modalInput}
              value={testAtKValue}
              onChangeText={setTestAtKValue}
              keyboardType="number-pad"
              selectTextOnFocus
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setTestAtKVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleTestAtKSubmit}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
