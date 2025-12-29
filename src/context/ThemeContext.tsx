import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveTheme, loadTheme } from '../storage';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  inputBackground: string;
  correct: string;
  incorrect: string;
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: '#FAF8F5',
  surface: '#FFFFFF',
  text: '#2C2416',
  textSecondary: '#6B5B4F',
  border: '#D4C4B0',
  primary: '#8B7355',
  inputBackground: '#F5F0E8',
  correct: '#4A7C59',
  incorrect: '#A65D57',
};

const darkColors: ThemeColors = {
  background: '#1A1814',
  surface: '#2C2620',
  text: '#F5F0E8',
  textSecondary: '#A89F94',
  border: '#4A433A',
  primary: '#C4A77D',
  inputBackground: '#363028',
  correct: '#6B9B7A',
  incorrect: '#C47D77',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme().then(setIsDark);
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    saveTheme(newValue);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
