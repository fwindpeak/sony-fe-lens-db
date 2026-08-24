import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Sparkles,
  Check,
  Plus,
} from 'lucide-react';
import { Lens } from '../types/lens';
import { OpticalRadarChart } from './OpticalRadarChart';
import { formatPrice, formatWeight, formatLength, getScoreColor } from '../utils/formatters';

interface LensDetailModalProps {
  lens: Lens | null;
  onClose: () => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
}

export const LensDetailModal: React.FC<LensDetailModalProps> = ({
  lens,
  onClose,
  isComparing,
  onToggleCompare,
}) => {
  const { t, i18n } = useTranslation();
  if (!lens) return null;

  const isZh = i18n.language.startsWith('zh');
  const scoreStyle = getScoreColor(lens.overallScore);

  const opticalMetrics = [
    { label: t('modal.scores.sharpness'), score: lens.sharpnessScore },
    { label: t('modal.scores.uniformity'), score: lens.uniformityScore },
    { label: t('modal.scores.wideOpen'), score: lens.wideOpenScore },
    { label: t('modal.scores.caControl'), score: lens.caControlScore },
    { label: t('modal.scores.bokeh'), score: lens.bokehScore },
    { label: t('modal.scores.distortion'), score: lens.distortionScore },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto overscroll-contain">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#131620] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-slide-up">
        {/* 顶部标题栏 */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                {isZh ? lens.brandZh : lens.brandEn}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {lens.releaseDate ? t('modal.released', { date: lens.releaseDate }) : ''}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {lens.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 弹窗主体 */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto overscroll-contain">
          {/* 上部两栏：左侧六维雷达图，右侧关键指标与评分 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* 雷达图 */}
            <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/60">
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('modal.radarTitle')}</span>
              </h4>
              <OpticalRadarChart lens={lens} size={250} />
            </div>

            {/* 六维光学评分列表 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {t('modal.overallScore')}
                </span>
                <span className={`text-2xl font-black font-mono ${scoreStyle.text}`}>
                  {lens.overallScore.toFixed(1)}{' '}
                  <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {opticalMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                      <span className="font-medium">{m.label}</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {m.score.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(m.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 详细规格数据网格 */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {t('modal.specsTitle')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.focalRange')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lens.focalDesc} ({lens.type})
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.maxAperture')}</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {lens.apertureDesc}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.focusAndOss')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lens.isAF ? 'AF' : 'MF'} / {lens.hasOSS ? t('modal.specs.withOss') : t('modal.specs.noOss')}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.filterThread')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lens.filterThread && lens.filterThread !== '-' ? `Φ${lens.filterThread} mm` : t('modal.specs.noFilter')}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.minFocus')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lens.minFocusDist && lens.minFocusDist !== '-' ? `${lens.minFocusDist} cm` : '-'}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.weight')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatWeight(lens.weightG)}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.length')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatLength(lens.lengthMm)}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-sans text-[11px]">{t('modal.specs.price')}</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {lens.priceCny > 0 ? `¥${formatPrice(lens.priceCny)}` : t('card.pending')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <button
            onClick={() => onToggleCompare(lens.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isComparing
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white'
            }`}
          >
            {isComparing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isComparing ? t('modal.inCompare') : t('modal.addToCompare')}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
