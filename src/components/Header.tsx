import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Moon,
  Sun,
  Globe,
  Camera,
  Layers,
  Github,
  Share2,
  Check,
  Lock,
  MoreVertical,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface HeaderProps {
  totalCount: number;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalCount, onOpenAdminModal }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdminAuth();

  const [isCopied, setIsCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      window.prompt('请复制当前分享链接：', window.location.href);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* 左侧 Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-md sm:shadow-lg shadow-orange-500/20 text-white font-bold shrink-0">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent truncate">
                SONY FE
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-base sm:text-xl truncate">
                Lens DB
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                E-Mount FF
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* 右侧 功能按钮与操作栏 */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* 桌面端：镜头总数 */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>{t('app.totalLenses', { count: totalCount })}</span>
          </div>

          {/* 桌面端：数据资产管理入口 (受口令保护) */}
          <button
            onClick={onOpenAdminModal}
            title={isAdmin ? '数据库管理 (已授权)' : '数据库管理 (需要权限)'}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isAdmin
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-orange-500" />}
            <span>{isAdmin ? '数据已授权' : '数据管理'}</span>
          </button>

          {/* 桌面端：分享按钮 */}
          <button
            onClick={handleShare}
            title={isCopied ? t('app.linkCopied') : t('app.shareView')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isCopied
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5 text-orange-500" />}
            <span>{isCopied ? t('app.linkCopied') : t('app.share')}</span>
          </button>

          {/* 桌面端：语言切换 */}
          <button
            onClick={toggleLanguage}
            title={i18n.language.startsWith('zh') ? 'Switch to English' : '切换为中文'}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="uppercase font-semibold text-[11px]">
              {i18n.language.startsWith('zh') ? 'EN' : '中'}
            </span>
          </button>

          {/* 丝滑二态主题切换 (暗色 / 亮色) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? '切换为亮色模式' : '切换为暗色模式'}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer group"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* 桌面端：GitHub 链接 */}
          <a
            href="https://github.com/fwindpeak/sony-fe-lens-db"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="hidden sm:inline-flex p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* 移动端专属：更多功能折叠菜单 (More Menu) */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              aria-label="更多操作"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#161a26] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/80 p-1.5 z-50 text-xs animate-slide-up space-y-0.5">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{i18n.language.startsWith('zh') ? '切换为 English' : '切换为 中文'}</span>
                </button>

                <button
                  onClick={() => {
                    handleShare();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isCopied ? t('app.linkCopied') : t('app.shareView')}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdminModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{isAdmin ? '数据库管理 (已授权)' : '数据管理 (权限控制)'}</span>
                </button>

                <a
                  href="https://github.com/fwindpeak/sony-fe-lens-db"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub 开源仓库</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
