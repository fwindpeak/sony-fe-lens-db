import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Shield,
  ChevronRight,
  Plus,
  Check,
} from 'lucide-react';
import { Lens } from '../types/lens';
import { formatPrice, formatWeight, getScoreColor } from '../utils/formatters';

interface LensCardProps {
  lens: Lens;
  onOpenDetail: (lens: Lens) => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
}

export const LensCard: React.FC<LensCardProps> = ({
  lens,
  onOpenDetail,
  isComparing,
  onToggleCompare,
}) => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const scoreStyle = getScoreColor(lens.overallScore);

  // 品牌色标
  const getBrandBadge = () => {
    if (lens.isGM) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-red-600 text-white shadow-sm flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          GM
        </span>
      );
    }
    if (lens.isG) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-500 text-black shadow-sm">
          G
        </span>
      );
    }
    if (lens.isZeiss) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white shadow-sm">
          ZEISS
        </span>
      );
    }
    if (lens.brandCategory === 'sigma') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-100 border border-slate-600">
          SIGMA
        </span>
      );
    }
    if (lens.brandCategory === 'tamron') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-700 text-white">
          TAMRON
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        {isZh ? lens.brandZh.split(' ')[0] : lens.brandEn}
      </span>
    );
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white dark:bg-[#131620] border border-slate-200/80 dark:border-slate-800/80 hover:border-orange-500/50 dark:hover:border-orange-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 glow-hover shadow-sm">
      {/* 头部：品牌徽标 + 对比加入按钮 */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            {getBrandBadge()}
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              {lens.releaseDate || ''}
            </span>
          </div>

          {/* PK 对比按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(lens.id);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              isComparing
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-orange-500/10 hover:text-orange-600'
            }`}
            title={isComparing ? t('card.inCompare') : t('card.compare')}
          >
            {isComparing ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span>{t('card.inCompare')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>{t('card.compare')}</span>
              </>
            )}
          </button>
        </div>

        {/* 镜头完整名称 */}
        <h3
          onClick={() => onOpenDetail(lens)}
          className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-orange-500 transition-colors line-clamp-2 cursor-pointer mb-3"
          title={lens.name}
        >
          {lens.name}
        </h3>

        {/* 核心规格参数胶囊 */}
        <div className="grid grid-cols-3 gap-1.5 mb-3.5 text-[11px] font-mono">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg text-center border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-sans">{t('card.focal')}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {lens.focalDesc}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg text-center border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-sans">{t('card.aperture')}</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {lens.apertureDesc}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg text-center border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] font-sans">{t('card.weight')}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {formatWeight(lens.weightG)}
            </span>
          </div>
        </div>

        {/* 特性标签行 (AF/MF, OSS, 滤镜口径, 微距等) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px]">
          <span
            className={`px-1.5 py-0.5 rounded font-semibold ${
              lens.isAF
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            {lens.isAF ? t('card.af') : t('card.mf')}
          </span>

          {lens.hasOSS && (
            <span className="px-1.5 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5" />
              {t('card.oss')}
            </span>
          )}

          {lens.filterThread && lens.filterThread !== '-' && lens.filterThread !== '无' && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              Φ{lens.filterThread}
            </span>
          )}

          {lens.isMacro && (
            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
              {t('card.macro')}
            </span>
          )}
        </div>

        {/* 光学总分与锐度评价 */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 mb-4 border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              {t('card.overall')}
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black font-mono tracking-tight ${scoreStyle.text}`}>
                {lens.overallScore.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400 font-sans">/100</span>
            </div>
          </div>

          {/* 指数条: 性价比 & 便携度 */}
          <div className="space-y-1.5 text-[11px]">
            <div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-0.5">
                <span>{t('card.value')}</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {lens.valueScore}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(lens.valueScore, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-0.5">
                <span>{t('card.portability')}</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {lens.portabilityScore}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(lens.portabilityScore, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部价格与详情入口 */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">{t('card.price')}</span>
          <div className="text-base font-extrabold text-orange-600 dark:text-orange-400 font-mono">
            {lens.priceCny > 0 ? `¥${formatPrice(lens.priceCny)}` : t('card.pending')}
          </div>
        </div>

        <button
          onClick={() => onOpenDetail(lens)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors py-1 pl-2"
        >
          <span>{t('card.viewDetail')}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
