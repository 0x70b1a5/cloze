import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface BlankInputProps {
  expectedWord: string;
  caseSensitive: boolean;
  exactPunctuation: boolean;
  diacriticSensitive: boolean;
  onSpace: () => void;
  width: number;
}

export interface BlankInputRef {
  focus: () => void;
  blur: () => void;
  getResult: () => { value: string; isCorrect: boolean };
}

const normalizeWord = (word: string, caseSensitive: boolean, exactPunctuation: boolean, diacriticSensitive: boolean): string => {
  let normalized = word;
  if (!exactPunctuation) {
    normalized = normalized.replace(/[^\w\s]/g, '');
  }
  if (!caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  if (!diacriticSensitive) {
    // Decompose characters with diacritics (é → e + combining accent)
    // Then remove combining diacritical marks
    // This preserves ligatures like æ and œ which don't decompose
    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  return normalized.trim();
};

export const BlankInput = forwardRef<BlankInputRef, BlankInputProps>(
  ({ expectedWord, caseSensitive, exactPunctuation, diacriticSensitive, onSpace, width }, ref) => {
    const { colors } = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState('');

    const checkAnswer = (input: string): boolean => {
      const normalizedInput = normalizeWord(input, caseSensitive, exactPunctuation, diacriticSensitive);
      const normalizedExpected = normalizeWord(expectedWord, caseSensitive, exactPunctuation, diacriticSensitive);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      // Check if user pressed space
      if (text.endsWith(' ')) {
        const trimmed = text.trimEnd();
        setValue(trimmed);
        onSpace();
      } else {
        setValue(text);
      }
    };

    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        autoCapitalize={caseSensitive ? 'sentences' : 'none'}
        autoCorrect="off"
        spellCheck={false}
        style={{
          fontFamily: 'serif',
          fontSize: '18px',
          // lineHeight: '28px',
          borderBottom: `2px solid ${colors.border}`,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          backgroundColor: colors.inputBackground,
          padding: '2px',
          color: colors.text,
          width: `${width}rem`,
          margin: '0 2px',
          outline: 'none',
        }}
      />
    );
  }
);

BlankInput.displayName = 'BlankInput';
