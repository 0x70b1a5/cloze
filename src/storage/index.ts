import { Passage } from '../types';

const PASSAGES_KEY = '@cloze_passages';
const THEME_KEY = '@cloze_theme';

export const savePassages = async (passages: Passage[]): Promise<void> => {
  localStorage.setItem(PASSAGES_KEY, JSON.stringify(passages));
};

export const loadPassages = async (): Promise<Passage[]> => {
  const data = localStorage.getItem(PASSAGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTheme = async (isDark: boolean): Promise<void> => {
  localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
};

export const loadTheme = async (): Promise<boolean> => {
  const data = localStorage.getItem(THEME_KEY);
  return data ? JSON.parse(data) : false;
};
