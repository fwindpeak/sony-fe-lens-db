import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scale,
  X,
  Trash2,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Award,
  Feather,
  CircleDollarSign,
  Zap,
} from 'lucide-react';
import { Lens } from '../types/lens';
import { OpticalRadarChart } from './OpticalRadarChart';
import { formatPrice, formatWeight, formatLength } from '../utils/formatters';

interface ComparisonDrawerProps {
  comparedLenses: Lens[];
  onRemove: (id: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectLens?: (lens: Lens) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  comparedLenses,
  onRemove,
  onClear,
  isOpen,
  onToggleOpen,
  onSelectLens,
}) => {
  const { t, i18n } = useTranslation();

  // 监听 ESC 按键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggleOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggleOpen]);

  if (comparedLenses.length === 0) return null;

  const isZh = i18n.language.startsWith('zh');

  // 计算比对中的极值亮点
  const maxScore = Math.max(...comparedLenses.map((l) => l.overallScore));
  const validPrices = comparedLenses.filter((l) => l.priceCny > 0);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices.map((l) => l.priceCny)) : -1;
  const validWeights = comparedLenses.filter((l) => l.weightG > 0);
  const minWeight = validWeights.length > 0 ? Math.min(...validWeights.map((l) => l.weightG)) : -1;
  const maxSharpness = Math.max(...comparedLenses.map((l) => l.sharpnessScore));

  const getCardGridClass = () => {
    switch (comparedLenses.length) {
      case 1:
        return 'grid-cols-1 max-w-md mx-auto';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <>
      {/* 底部悬浮折叠状态栏 (未展开时常驻底部) */}
      {!isOpen && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="glass bg-white/95 dark:bg-[#131620]/95 border border-orange-500/30 rounded-2xl p-3 shadow-2xl flex items-center justify-between animate-slide-up backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {t('app.compare.title')}
                  </span>
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold ml-2">
                    {t('app.compare.subtitle', { count: comparedLenses.length })}
                  </span>
                </div>
              </div>

              {/* 缩略微缩标签 */}
              <div className="hidden md:flex items-center gap-2">
                {comparedLenses.map((lens) => (
                  <span
                    key={lens.id}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold max-w-[130px] truncate"
                  >
                    {lens.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleOpen}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <span>{t('app.compare.expand')}</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={onClear}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title={t('app.compare.clear')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 展开的全局居中 PK 对比弹窗 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) onToggleOpen();
          }}
        >
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-[#131620] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto animate-slide-up">
            {/* 顶部标题栏 */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                  <Scale className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>{t('app.compare.title')}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {comparedLenses.length}/4
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClear}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('app.compare.clear')}</span>
                </button>
                <button
                  onClick={onToggleOpen}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={t('app.compare.collapse')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 对比主体内容 (可平滑纵向滚动) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-6">
              {/* 多镜头雷达图叠加可视化 */}
              <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>{t('app.compare.radarTitle')}</span>
                </div>
                
                <OpticalRadarChart compareLenses={comparedLenses} size={280} />
                
                {/* 雷达图镜头颜色图例 */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs font-semibold">
                  {comparedLenses.map((lens, idx) => {
                    const colorClasses = [
                      'text-orange-500 bg-orange-500/10 border-orange-500/30',
                      'text-blue-500 bg-blue-500/10 border-blue-500/30',
                      'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
                      'text-purple-500 bg-purple-500/10 border-purple-500/30',
                    ];
                    const dotColors = ['bg-[#FF5A00]', 'bg-[#3b82f6]', 'bg-[#10b981]', 'bg-[#a855f7]'];
                    return (
                      <div
                        key={lens.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] ${colorClasses[idx % 4]}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${dotColors[idx % 4]}`} />
                        <span className="truncate max-w-[160px]">{lens.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 横向并排参数卡片 */}
              <div className={`grid ${getCardGridClass()} gap-4`}>
                {comparedLenses.map((lens, idx) => {
                  const isTopScore = comparedLenses.length > 1 && lens.overallScore === maxScore;
                  const isLowestPrice = comparedLenses.length > 1 && minPrice > 0 && lens.priceCny === minPrice;
                  const isLightest = comparedLenses.length > 1 && minWeight > 0 && lens.weightG === minWeight;
                  const isTopSharpness = comparedLenses.length > 1 && lens.sharpnessScore === maxSharpness && maxSharpness > 0;

                  const borderAccent = [
                    'border-orange-500/40 dark:border-orange-500/30',
                    'border-blue-500/40 dark:border-blue-500/30',
                    'border-emerald-500/40 dark:border-emerald-500/30',
                    'border-purple-500/40 dark:border-purple-500/30',
                  ][idx % 4];

                  return (
                    <div
                      key={lens.id}
                      className={`relative bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl p-4 border ${borderAccent} shadow-sm flex flex-col justify-between space-y-4`}
                    >
                      {/* 单卡片右上角移除 */}
                      <button
                        onClick={() => onRemove(lens.id)}
                        className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        title={t('app.compare.clear')}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/20">
                            {isZh ? lens.brandZh : lens.brandEn}
                          </span>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-1.5 pr-6 line-clamp-2 leading-snug">
                            {lens.name}
                          </h4>
                        </div>

                        {/* PK 胜出徽章 */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {isTopScore && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-md">
                              <Award className="w-3 h-3" />
                              <span>{isZh ? '综合最高' : 'Top Score'}</span>
                            </span>
                          )}
                          {isLowestPrice && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-md">
                              <CircleDollarSign className="w-3 h-3" />
                              <span>{isZh ? '最亲民价格' : 'Best Price'}</span>
                            </span>
                          )}
                          {isLightest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 rounded-md">
                              <Feather className="w-3 h-3" />
                              <span>{isZh ? '最轻巧' : 'Lightest'}</span>
                            </span>
                          )}
                          {isTopSharpness && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-md">
                              <Zap className="w-3 h-3" />
                              <span>{isZh ? '锐度最佳' : 'Sharpest'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 关键参数比对条目 */}
                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('modal.overallScore')}:</span>
                          <span className="font-black text-orange-600 dark:text-orange-400">
                            {lens.overallScore.toFixed(1)} / 100
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('table.sharpness')}:</span>
                          <span className="font-bold text-amber-500">{lens.sharpnessStar}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('card.value')}:</span>
                          <span className="font-bold">{lens.valueScore}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('card.portability')}:</span>
                          <span className="font-bold">{lens.portabilityScore}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('table.focal')} / {t('table.aperture')}:</span>
                          <span className="font-bold">
                            {lens.focalDesc} {lens.apertureDesc}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('card.weight')}:</span>
                          <span className="font-bold">{formatWeight(lens.weightG)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('card.length')}:</span>
                          <span className="font-bold">{formatLength(lens.lengthMm)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('card.filter')}:</span>
                          <span className="font-bold">
                            {lens.filterThread && lens.filterThread !== '-'
                              ? `Φ${lens.filterThread}`
                              : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 font-sans">{t('modal.specs.focusAndOss')}:</span>
                          <span className="font-bold">
                            {lens.hasOSS ? t('modal.specs.withOss') : t('modal.specs.noOss')} / {lens.isAF ? 'AF' : 'MF'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 pt-2">
                          <span className="text-slate-500 font-sans">{t('card.price')}:</span>
                          <span className="font-extrabold text-sm text-orange-600 dark:text-orange-400">
                            {lens.priceCny > 0 ? `¥${formatPrice(lens.priceCny)}` : t('card.pending')}
                          </span>
                        </div>
                      </div>

                      {/* 底部查看详情按钮 */}
                      {onSelectLens && (
                        <button
                          onClick={() => onSelectLens(lens)}
                          className="w-full mt-2 py-2 px-3 bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{t('card.viewDetail')}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
