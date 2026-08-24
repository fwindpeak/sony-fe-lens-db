import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Monitor, Globe, Camera, Layers, Github } from 'lucide-react';
import { useTheme, ThemeMode } from '../hooks/useTheme';

interface HeaderProps {
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ totalCount }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

  const cycleTheme = () => {
    const order: ThemeMode[] = ['dark', 'light', 'system'];
    const nextIdx = (order.indexOf(theme) + 1) % order.length;
    setTheme(order[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 左侧 Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold tracking-tighter">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                SONY FE
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-lg sm:text-xl">
                Lens DB
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                E-Mount FF
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* 右侧 功能按钮与操作栏 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 总数徽标 */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>{t('app.totalLenses', { count: totalCount })}</span>
          </div>

          {/* 语言切换 */}
          <button
            onClick={toggleLanguage}
            title={i18n.language.startsWith('zh') ? 'Switch to English' : '切换为中文'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="uppercase font-semibold">
              {i18n.language.startsWith('zh') ? 'EN' : '中'}
            </span>
          </button>

          {/* 主题切换 */}
          <button
            onClick={cycleTheme}
            title={`Current: ${theme}`}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            {theme === 'dark' && <Moon className="w-4 h-4 text-orange-400" />}
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'system' && <Monitor className="w-4 h-4 text-blue-400" />}
          </button>

          {/* GitHub 链接 */}
          <a
            href="https://github.com/fwindpeak/sony-fe-lens-db"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
