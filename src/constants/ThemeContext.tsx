import { createContext, useContext } from 'react';
import { DARK_COLORS, type ColorTheme } from './styles';

export const ThemeContext = createContext<ColorTheme>(DARK_COLORS);

export const useThemeColors = () => useContext(ThemeContext);
