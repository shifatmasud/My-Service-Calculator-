import React from 'react';
import { useTheme } from '../../ThemeProvider';
import { Sun, Moon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
  const { theme, themeMode, toggleTheme } = useTheme();

  const styles = {
    button: {
      position: 'fixed',
      top: theme.spacing.l,
      right: theme.spacing.l,
      zIndex: 101,
      background: theme.colors.base.surface[2],
      border: `1.5px solid ${theme.colors.base.surface[3]}`,
      borderRadius: theme.radius.full,
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: theme.colors.base.content[2],
      transition: `all ${theme.motion.duration.subtle}ms ${theme.motion.easing}`,
      boxShadow: theme.effects.shadow.soft('rgba(0,0,0,0.1)'),
      overflow: 'hidden',
    } as React.CSSProperties,
  };

  return (
    <motion.button 
      style={styles.button} 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1, borderColor: theme.colors.primary.surface[1] }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={themeMode}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: theme.motion.duration.standard / 1000 }}
        >
          {themeMode === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeSwitcher;