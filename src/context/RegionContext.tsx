import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Region {
  country: string;
  state: string | null;
}

interface RegionContextType {
  region: Region;
  setRegion: (newRegion: Region) => void;
  availableCountries: string[];
  statesByCountry: Record<string, string[]>;
}

const defaultRegion: Region = {
  country: 'Australia',
  state: 'New South Wales',
};

// This would be expanded with more countries and states in a real app
const availableCountries = ['Australia', 'United States', 'United Kingdom', 'Canada', 'New Zealand'];

const statesByCountry: Record<string, string[]> = {
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'],
  'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'],
  'New Zealand': ['Auckland', 'Bay of Plenty', 'Canterbury', 'Gisborne', 'Hawke\'s Bay', 'Manawatu-Whanganui', 'Marlborough', 'Nelson', 'Northland', 'Otago', 'Southland', 'Taranaki', 'Tasman', 'Waikato', 'Wellington', 'West Coast'],
};

const RegionContext = createContext<RegionContextType>({
  region: defaultRegion,
  setRegion: () => {},
  availableCountries,
  statesByCountry,
});

export const useRegion = () => useContext(RegionContext);

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<Region>(defaultRegion);

  useEffect(() => {
    // Load region from storage
    const loadRegion = async () => {
      try {
        const storedRegion = await AsyncStorage.getItem('region');
        if (storedRegion) {
          setRegionState(JSON.parse(storedRegion));
        }
      } catch (error) {
        console.error('Failed to load region', error);
      }
    };

    loadRegion();
  }, []);

  const setRegion = async (newRegion: Region) => {
    try {
      await AsyncStorage.setItem('region', JSON.stringify(newRegion));
      setRegionState(newRegion);
    } catch (error) {
      console.error('Failed to save region', error);
    }
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, availableCountries, statesByCountry }}>
      {children}
    </RegionContext.Provider>
  );
};