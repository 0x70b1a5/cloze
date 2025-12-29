import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface BlankInputProps {
  expectedWord: string;
  caseSensitive: boolean;
  exactPunctuation: boolean;
  onSpace: () => void;
  width: number;
}

export interface BlankInputRef {
  focus: () => void;
  blur: () => void;
  getResult: () => { value: string; isCorrect: boolean };
}

const normalizeWord = (word: string, caseSensitive: boolean, exactPunctuation: boolean): string => {
  let normalized = word;
  if (!exactPunctuation) {
    normalized = normalized.replace(/[^\w\s]/g, '');
  }
  if (!caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  return normalized.trim();
};

export const BlankInput = forwardRef<BlankInputRef, BlankInputProps>(
  ({ expectedWord, caseSensitive, exactPunctuation, onSpace, width }, ref) => {
    const { colors } = useTheme();
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const checkAnswer = (input: string): boolean => {
      const normalizedInput = normalizeWord(input, caseSensitive, exactPunctuation);
      const normalizedExpected = normalizeWord(expectedWord, caseSensitive, exactPunctuation);
      return normalizedInput === normalizedExpected;
    };

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      getResult: () => ({
        value,
        isCorrect: checkAnswer(value),
      }),
    }));

    const styles = StyleSheet.create({
      container: {
        minWidth: Math.max(width, 40),
        marginHorizontal: 2,
      },
      input: {
        fontFamily: 'serif',
        fontSize: 18,
        lineHeight: 28,
        borderBottomWidth: 2,
        borderBottomColor: isCorrect === true
          ? colors.correct
          : isCorrect === false
            ? colors.incorrect
            : colors.border,
        backgroundColor: colors.inputBackground,
        paddingHorizontal: 4,
        paddingVertical: 2,
        color: colors.text,
        textAlign: 'center',
      },
    });

    const handleChangeText = (text: string) => {
      // Check if user pressed space
      if (text.endsWith(' ')) {
        const trimmed = text.trimEnd();
        setValue(trimmed);
        // Show visual feedback but don't trigger any scoring yet
        setIsCorrect(checkAnswer(trimmed));
        onSpace();
      } else {
        setValue(text);
        setIsCorrect(null);
      }
    };

    return (
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          autoCapitalize={caseSensitive ? 'sentences' : 'none'}
          autoCorrect={false}
          spellCheck={false}
        />
      </View>
    );
  }
);
