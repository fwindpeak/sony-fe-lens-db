import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sony_lens_db_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // 首次进入若无手动记录，根据当前系统色彩设定初始值，之后完全由用户手动二态切换
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const root = document.documentElement;
    // 增加全局平滑过渡类，使得背景与文字切换极为丝滑
    root.classList.add('theme-smooth-transition');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('sony_lens_db_theme', theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
