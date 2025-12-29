import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Passage } from '../types';
import { savePassages, loadPassages } from '../storage';

interface PassagesContextType {
  passages: Passage[];
  addPassage: (title: string, text: string, caseSensitive: boolean, exactPunctuation: boolean) => string;
  updatePassage: (id: string, updates: Partial<Omit<Passage, 'id'>>) => void;
  deletePassage: (id: string) => void;
  getPassage: (id: string) => Passage | undefined;
  decrementKelvin: (passageId: string) => void;
  incrementKelvin: (passageId: string) => void;
  setKelvin: (passageId: string, kelvin: number) => void;
  isComplete: (passage: Passage) => boolean;
}

const PassagesContext = createContext<PassagesContextType | undefined>(undefined);

export const PassagesProvider = ({ children }: { children: ReactNode }) => {
  const [passages, setPassages] = useState<Passage[]>([]);

  useEffect(() => {
    loadPassages().then(setPassages);
  }, []);

  const persist = (newPassages: Passage[]) => {
    setPassages(newPassages);
    savePassages(newPassages);
  };

  const getWords = (text: string) => text.split(/\s+/).filter(w => w.length > 0);

  const addPassage = (title: string, text: string, caseSensitive: boolean, exactPunctuation: boolean): string => {
    const id = uuidv4();
    const wordCount = getWords(text).length;
    const newPassage: Passage = {
      id,
      title,
      text,
      caseSensitive,
      exactPunctuation,
      kelvin: wordCount,
    };
    persist([...passages, newPassage]);
    return id;
  };

  const updatePassage = (id: string, updates: Partial<Omit<Passage, 'id'>>) => {
    const newPassages = passages.map(p => {
      if (p.id === id) {
        // If text changed, reset kelvin to new word count
        if (updates.text !== undefined && updates.text !== p.text) {
          const newWordCount = getWords(updates.text).length;
          return { ...p, ...updates, kelvin: newWordCount };
        }
        return { ...p, ...updates };
      }
      return p;
    });
    persist(newPassages);
  };

  const deletePassage = (id: string) => {
    persist(passages.filter(p => p.id !== id));
  };

  const getPassage = (id: string) => passages.find(p => p.id === id);

  const decrementKelvin = (passageId: string) => {
    const newPassages = passages.map(p => {
      if (p.id === passageId && p.kelvin > 0) {
        return { ...p, kelvin: p.kelvin - 1 };
      }
      return p;
    });
    persist(newPassages);
  };

  const incrementKelvin = (passageId: string) => {
    const newPassages = passages.map(p => {
      if (p.id === passageId) {
        const wordCount = getWords(p.text).length;
        if (p.kelvin < wordCount) {
          return { ...p, kelvin: p.kelvin + 1 };
        }
      }
      return p;
    });
    persist(newPassages);
  };

  const setKelvin = (passageId: string, kelvin: number) => {
    const newPassages = passages.map(p => {
      if (p.id === passageId) {
        const wordCount = getWords(p.text).length;
        const clampedKelvin = Math.max(0, Math.min(kelvin, wordCount));
        return { ...p, kelvin: clampedKelvin };
      }
      return p;
    });
    persist(newPassages);
  };

  const isComplete = (passage: Passage): boolean => {
    return passage.kelvin === 0;
  };

  return (
    <PassagesContext.Provider
      value={{
        passages,
        addPassage,
        updatePassage,
        deletePassage,
        getPassage,
        decrementKelvin,
        incrementKelvin,
        setKelvin,
        isComplete,
      }}>
      {children}
    </PassagesContext.Provider>
  );
};

export const usePassages = () => {
  const context = useContext(PassagesContext);
  if (!context) {
    throw new Error('usePassages must be used within a PassagesProvider');
  }
  return context;
};
