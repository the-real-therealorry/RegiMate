import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnswerSettings {
  maxWords: number;
  verbosityLevel: 'concise' | 'moderate' | 'detailed';
  fontSize: number;
  includeReferences: boolean;
  showFullClause: boolean;
}

interface SettingsContextType {
  answerSettings: AnswerSettings;
  updateAnswerSettings: (settings: Partial<AnswerSettings>) => void;
}

const defaultAnswerSettings: AnswerSettings = {
  maxWords: 300,
  verbosityLevel: 'moderate',
  fontSize: 16,
  includeReferences: true,
  showFullClause: false,
};

const SettingsContext = createContext<SettingsContextType>({
  answerSettings: defaultAnswerSettings,
  updateAnswerSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answerSettings, setAnswerSettings] = useState<AnswerSettings>(defaultAnswerSettings);

  useEffect(() => {
    // Load settings from storage
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('answerSettings');
        if (storedSettings) {
          setAnswerSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Failed to load answer settings', error);
      }
    };

    loadSettings();
  }, []);

  const updateAnswerSettings = async (settings: Partial<AnswerSettings>) => {
    const updatedSettings = { ...answerSettings, ...settings };
    try {
      await AsyncStorage.setItem('answerSettings', JSON.stringify(updatedSettings));
      setAnswerSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to save answer settings', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ answerSettings, updateAnswerSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};