'use client';

import { useCallback, useEffect, useState } from 'react';
import { style } from '@/app/resources';

export function useTheme() {
  const [theme, setTheme] = useState(style.theme);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const store = window.localStorage;
      if (!store || typeof store.getItem !== 'function') return;
      const savedTheme = store.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      const store = window.localStorage;
      if (store && typeof store.setItem === 'function') {
        store.setItem('theme', newTheme);
      }
    } catch {
      // ignore
    }
  }, [theme]);

  return {
    theme,
    toggleTheme
  };
}
