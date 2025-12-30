export interface Passage {
  id: string;
  title: string;
  text: string;
  caseSensitive: boolean;
  exactPunctuation: boolean;
  diacriticSensitive: boolean;
  kelvin: number; // number of blanks remaining (starts at word count)
}

export interface PassageWord {
  index: number;
  word: string;
  isBlank: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  Quiz: { passageId: string };
  Edit: { passageId?: string };
};
