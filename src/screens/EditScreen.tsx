import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { usePassages } from '../context/PassagesContext';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

export const EditScreen = ({ navigation, route }: Props) => {
  const { passageId } = route.params;
  const { getPassage, addPassage, updatePassage } = usePassages();
  const { colors } = useTheme();

  const existingPassage = passageId ? getPassage(passageId) : undefined;
  const isEditing = !!existingPassage;

  const [title, setTitle] = useState(existingPassage?.title ?? '');
  const [text, setText] = useState(existingPassage?.text ?? '');
  const [caseSensitive, setCaseSensitive] = useState(existingPassage?.caseSensitive ?? false);
  const [exactPunctuation, setExactPunctuation] = useState(existingPassage?.exactPunctuation ?? false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Passage' : 'New Passage',
    });
  }, [navigation, isEditing]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    label: {
      fontFamily: 'serif',
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      fontFamily: 'serif',
      fontSize: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
    },
    textArea: {
      minHeight: 200,
      textAlignVertical: 'top',
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionLabel: {
      fontFamily: 'serif',
      fontSize: 16,
      color: colors.text,
    },
    optionDescription: {
      fontFamily: 'serif',
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 32,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      fontFamily: 'serif',
      fontSize: 18,
      fontWeight: '600',
      color: colors.surface,
    },
    wordCount: {
      fontFamily: 'serif',
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
    },
    warning: {
      fontFamily: 'serif',
      fontSize: 14,
      color: colors.incorrect,
      marginTop: 8,
    },
  });

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const canSave = title.trim().length > 0 && wordCount > 0;
  const textChanged = isEditing && text !== existingPassage?.text;

  const handleSave = () => {
    if (!canSave) return;

    if (textChanged) {
      Alert.alert(
        'Reset Progress?',
        'Changing the passage text will reset your memorization progress. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: doSave,
          },
        ]
      );
    } else {
      doSave();
    }
  };

  const doSave = () => {
    if (isEditing && passageId) {
      updatePassage(passageId, { title, text, caseSensitive, exactPunctuation });
    } else {
      addPassage(title, text, caseSensitive, exactPunctuation);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title..."
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Passage</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={text}
          onChangeText={setText}
          placeholder="Enter the text you want to memorize..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <Text style={styles.wordCount}>
          {wordCount} word{wordCount !== 1 ? 's' : ''} = {wordCount}K
        </Text>
        {textChanged && (
          <Text style={styles.warning}>
            Changing text will reset progress
          </Text>
        )}

        <Text style={[styles.label, { marginTop: 24 }]}>Options</Text>

        <View style={styles.optionRow}>
          <View>
            <Text style={styles.optionLabel}>Case Sensitive</Text>
            <Text style={styles.optionDescription}>
              Require exact capitalization
            </Text>
          </View>
          <Switch
            value={caseSensitive}
            onValueChange={setCaseSensitive}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.optionRow}>
          <View>
            <Text style={styles.optionLabel}>Exact Punctuation</Text>
            <Text style={styles.optionDescription}>
              Require hyphens, apostrophes, etc.
            </Text>
          </View>
          <Switch
            value={exactPunctuation}
            onValueChange={setExactPunctuation}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Save Changes' : 'Create Passage'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
