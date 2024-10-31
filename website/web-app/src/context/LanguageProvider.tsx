import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextProps {
  language: string;
  changeLanguage: (lang: string) => void;
  translations: {
    [key: string]: {
      greeting: string;
      viewRequest: string;
      approval: string;
      home: string;
      settings: string;
    };
  };
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'English';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  const translations = {
    English: {
      greeting: 'Hello',
      viewRequest: 'View Request',
      approval: 'Approval',
      home: 'Home',
      settings: 'Settings',
    },
    Filipino: {
      greeting: 'Kamusta',
      viewRequest: 'Tingnan ang Kahilingan',
      approval: 'Pag-apruba',
      home: 'Bahay',
      settings: 'Mga Setting',
    },
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
