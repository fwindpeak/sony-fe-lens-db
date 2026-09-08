import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Monitor, Globe, Camera, Layers, Github, Share2, Check, Download } from 'lucide-react';
import { useTheme, ThemeMode } from '../hooks/useTheme';
import lensesData from '../data/lenses.json';

interface HeaderProps {
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ totalCount }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

  const cycleTheme = () => {
    const order: ThemeMode[] = ['dark', 'light', 'system'];
    const nextIdx = (order.indexOf(theme) + 1) % order.length;
    setTheme(order[nextIdx]);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // 降级使用 prompt
      window.prompt('请复制当前分享链接：', window.location.href);
    }
  };

  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lensesData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'sony_fe_lenses_calibrated.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportMenu(false);
  };

  const downloadCSV = () => {
    const headers = [
      '品牌', '镜头名称', '类型', '焦段', '最大光圈', '对焦', '防抖',
      '综合总分', '锐度均值', '边缘一致性', '全开可用度', '色散控制', '虚化氛围', '畸变暗角',
      '全新参考价', '二手参考价', '香港参考价', '上市时间', '重量_g', '滤镜口径', '官网链接'
    ];
    const rows = lensesData.map(l => [
      `"${l.brandZh}"`,
      `"${l.name}"`,
      `"${l.type}"`,
      `"${l.focalDesc}"`,
      `"${l.apertureDesc}"`,
      `"${l.focusType}"`,
      `"${l.ossDesc}"`,
      l.overallScore,
      l.sharpnessScore,
      l.uniformityScore,
      l.wideOpenScore,
      l.caControlScore,
      l.bokehScore,
      l.distortionScore,
      l.priceNew || l.priceCny || '',
      l.priceUsed || '',
      l.priceHk || '',
      `"${l.releaseDate || ''}"`,
      l.weightG,
      `"${l.filterThread || ''}"`,
      `"${l.officialUrl || ''}"`
    ].join(','));
    const csvContent = '\ufeff' + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', 'sony_fe_lenses_calibrated.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

          {/* 数据导出交流按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="导出数据 (JSON / CSV / SQLite)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline font-medium">导出数据</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1f2e] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700/80 p-1.5 z-50 text-xs animate-slide-up">
                <button
                  onClick={downloadJSON}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                >
                  <span className="font-semibold">导出 JSON 数据</span>
                  <span className="text-[10px] text-slate-400 font-mono">.json</span>
                </button>
                <button
                  onClick={downloadCSV}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                >
                  <span className="font-semibold">导出 CSV 表格</span>
                  <span className="text-[10px] text-slate-400 font-mono">.csv</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1 px-3 py-1 text-[10px] text-slate-400">
                  SQLite数据库已置于 dist/lenses.db
                </div>
              </div>
            )}
          </div>

          {/* 分享当前视图 / 链接 */}
          <button
            onClick={handleShare}
            title={isCopied ? t('app.linkCopied') : t('app.shareView')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isCopied
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5 text-orange-500" />}
            <span className="hidden sm:inline font-medium">{isCopied ? t('app.linkCopied') : t('app.share')}</span>
          </button>

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
