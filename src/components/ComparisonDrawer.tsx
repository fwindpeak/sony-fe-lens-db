import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scale,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Trophy,
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
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  comparedLenses,
  onRemove,
  onClear,
  isOpen,
  onToggleOpen,
}) => {
  const { t } = useTranslation();
  if (comparedLenses.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40">
      {/* 底部折叠状态栏 */}
      {!isOpen && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <div className="glass bg-white/90 dark:bg-[#131620]/90 border border-orange-500/30 rounded-2xl p-3 shadow-xl flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
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

            {/* 缩略小图标 */}
            <div className="hidden sm:flex items-center gap-2">
              {comparedLenses.map((lens) => (
                <span
                  key={lens.id}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold max-w-[120px] truncate"
                >
                  {lens.name}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleOpen}
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                <span>{t('app.compare.expand')}</span>
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={onClear}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title={t('app.compare.clear')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 展开的横向 PK 对比大面板 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#131620] rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl border-t border-slate-200 dark:border-slate-800 animate-slide-up">
            {/* 顶部标题栏 */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100">
                  {t('app.compare.title')} ({comparedLenses.length}/4)
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClear}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('app.compare.clear')}</span>
                </button>
                <button
                  onClick={onToggleOpen}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 对比主体内容 (横向滚动) */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* 多镜头雷达图叠加 */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>多镜头六维光学评分重叠对比</span>
                </h4>
                <OpticalRadarChart compareLenses={comparedLenses} size={280} />
                <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs font-semibold">
                  {comparedLenses.map((lens, idx) => {
                    const colors = [
                      'text-orange-500',
                      'text-blue-500',
                      'text-emerald-500',
                      'text-purple-500',
                    ];
                    return (
                      <div key={lens.id} className={`flex items-center gap-1.5 ${colors[idx % 4]}`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-current" />
                        <span className="truncate max-w-[150px]">{lens.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 横向并排参数卡片表格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {comparedLenses.map((lens) => (
                  <div
                    key={lens.id}
                    className="relative bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <button
                      onClick={() => onRemove(lens.id)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                      title="移出对比"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold">
                        {lens.brandZh}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-1 line-clamp-2 pr-6">
                        {lens.name}
                      </h4>
                    </div>

                    {/* 关键参数比对条目 */}
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">综合总分:</span>
                        <span className="font-black text-orange-600 dark:text-orange-400">
                          {lens.overallScore.toFixed(1)} / 100
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">锐度评级:</span>
                        <span className="font-bold text-amber-500">{lens.sharpnessStar}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">性价比指数:</span>
                        <span className="font-bold">{lens.valueScore}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">便携指数:</span>
                        <span className="font-bold">{lens.portabilityScore}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">焦段与光圈:</span>
                        <span className="font-bold">
                          {lens.focalDesc} {lens.apertureDesc}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">重量:</span>
                        <span className="font-bold">{formatWeight(lens.weightG)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">长度:</span>
                        <span className="font-bold">{formatLength(lens.lengthMm)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">滤镜口径:</span>
                        <span className="font-bold">
                          {lens.filterThread && lens.filterThread !== '-'
                            ? `Φ${lens.filterThread}`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-sans">防抖 / 对焦:</span>
                        <span className="font-bold">
                          {lens.hasOSS ? '支持防抖' : '无防抖'} / {lens.isAF ? 'AF' : 'MF'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-500 font-sans">参考售价:</span>
                        <span className="font-extrabold text-sm text-orange-600 dark:text-orange-400">
                          {lens.priceCny > 0 ? `¥${formatPrice(lens.priceCny)}` : '待定'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
