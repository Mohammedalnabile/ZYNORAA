import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, Theme } from '../styles/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  isNightMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('zynora-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    
    // Check for night time (8 PM - 6 AM) for auto dark mode
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) return 'dark';
    
    return 'light';
  });

  const [isNightMode, setIsNightMode] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 6;
  });

  const theme = mode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    localStorage.setItem('zynora-theme', mode);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.bg.primary);
    }
  }, [mode, theme]);

  useEffect(() => {
    // Check night mode every minute
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setIsNightMode(hour >= 20 || hour < 6);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme, setTheme, isNightMode }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
