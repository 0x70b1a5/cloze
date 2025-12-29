import AsyncStorage from '@react-native-async-storage/async-storage';
import { Passage } from '../types';

const PASSAGES_KEY = '@cloze_passages';
const THEME_KEY = '@cloze_theme';

export const savePassages = async (passages: Passage[]): Promise<void> => {
  await AsyncStorage.setItem(PASSAGES_KEY, JSON.stringify(passages));
};

export const loadPassages = async (): Promise<Passage[]> => {
  const data = await AsyncStorage.getItem(PASSAGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTheme = async (isDark: boolean): Promise<void> => {
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDark));
};

export const loadTheme = async (): Promise<boolean> => {
  const data = await AsyncStorage.getItem(THEME_KEY);
  return data ? JSON.parse(data) : false;
};
