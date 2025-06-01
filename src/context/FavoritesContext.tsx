import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
  region: {
    country: string;
    state: string | null;
  };
  timestamp: number;
  standard?: string;
  clause?: string;
}

interface FavoritesContextType {
  favorites: QuestionAnswer[];
  addFavorite: (item: QuestionAnswer) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<QuestionAnswer[]>([]);

  useEffect(() => {
    // Load favorites from storage
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };

    loadFavorites();
  }, []);

  const saveFavorites = async (newFavorites: QuestionAnswer[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites', error);
    }
  };

  const addFavorite = (item: QuestionAnswer) => {
    // Ensure the item has an id
    const newItem = { ...item, id: item.id || Date.now().toString() };
    const newFavorites = [...favorites, newItem];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFavorite = (id: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};