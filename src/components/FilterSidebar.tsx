import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, RotateCcw, X, Shield, DollarSign, Weight, Star, PanelLeftClose } from 'lucide-react';
import { FilterState, BrandCategory, FocalCategory } from '../types/lens';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  onToggleFocalCategory: (cat: FocalCategory) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const BRANDS: { key: BrandCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'filters.brands.all' },
  { key: 'sony', labelKey: 'filters.brands.sony' },
  { key: 'sigma', labelKey: 'filters.brands.sigma' },
  { key: 'tamron', labelKey: 'filters.brands.tamron' },
  { key: 'zeiss', labelKey: 'filters.brands.zeiss' },
  { key: 'samyang', labelKey: 'filters.brands.samyang' },
  { key: 'viltrox', labelKey: 'filters.brands.viltrox' },
  { key: 'laowa', labelKey: 'filters.brands.laowa' },
  { key: 'voigtlander', labelKey: 'filters.brands.voigtlander' },
  { key: 'ttartisan', labelKey: 'filters.brands.ttartisan' },
  { key: '7artisans', labelKey: 'filters.brands.7artisans' },
  { key: 'yongnuo', labelKey: 'filters.brands.yongnuo' },
  { key: 'other', labelKey: 'filters.brands.other' },
];

const FOCAL_RANGES: { key: FocalCategory; labelKey: string; desc: string }[] = [
  { key: 'ultra-wide', labelKey: 'filters.focalRanges.ultraWide', desc: '<24mm' },
  { key: 'wide', labelKey: 'filters.focalRanges.wide', desc: '24-35mm' },
  { key: 'standard', labelKey: 'filters.focalRanges.standard', desc: '35-60mm' },
  { key: 'telephoto', labelKey: 'filters.focalRanges.telephoto', desc: '70-135mm' },
  { key: 'super-telephoto', labelKey: 'filters.focalRanges.superTelephoto', desc: '>135mm' },
];

const FILTER_THREADS = ['all', '49', '55', '67', '72', '77', '82', '86', '95'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  onToggleFocalCategory,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { t } = useTranslation();

  const content = (
    <div className="space-y-6 pb-6 select-none">
      {/* 顶部标题、收起与重置按钮 */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-bold text-base text-slate-800 dark:text-slate-100">
          <Filter className="w-4 h-4 text-orange-500" />
          <span>{t('filters.title')}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium px-1.5 py-1 rounded-md hover:bg-orange-500/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('app.resetAll')}</span>
          </button>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={t('filters.collapse')}
              className="hidden lg:flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. 品牌厂商 */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {t('filters.brand')}
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 overscroll-contain">
          {BRANDS.map((b) => {
            const isSelected = filters.brandCategory === b.key;
            return (
              <button
                key={b.key}
                onClick={() =>
                  onFilterChange({ ...filters, brandCategory: b.key, preset: null })
                }
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white font-semibold shadow-sm'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={t(b.labelKey)}
              >
                {t(b.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 定焦 / 变焦 */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {t('filters.type')}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['all', '定焦', '变焦'] as const).map((typeVal) => (
            <button
              key={typeVal}
              onClick={() =>
                onFilterChange({ ...filters, type: typeVal, preset: null })
              }
              className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                filters.type === typeVal
                  ? 'bg-orange-500 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {typeVal === 'all'
                ? t('filters.types.all')
                : typeVal === '定焦'
                ? t('filters.types.prime')
                : t('filters.types.zoom')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 对焦方式 & 光学防抖 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 对焦方式 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {t('filters.focus')}
          </label>
          <div className="flex flex-col gap-1">
            {[
              { key: 'all', labelKey: 'filters.focusTypes.all' },
              { key: 'af', labelKey: 'filters.focusTypes.af' },
              { key: 'mf', labelKey: 'filters.focusTypes.mf' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    focusType: f.key as 'all' | 'af' | 'mf',
                  })
                }
                className={`py-1 px-2 rounded text-xs text-left transition-all ${
                  filters.focusType === f.key
                    ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold border border-orange-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* 光学防抖 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {t('filters.oss')}
          </label>
          <div className="flex flex-col gap-1">
            {[
              { key: 'all', labelKey: 'filters.ossOptions.all' },
              { key: 'yes', labelKey: 'filters.ossOptions.yes' },
              { key: 'no', labelKey: 'filters.ossOptions.no' },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    hasOSS: o.key as 'all' | 'yes' | 'no',
                  })
                }
                className={`py-1 px-2 rounded text-xs text-left transition-all ${
                  filters.hasOSS === o.key
                    ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold border border-orange-500/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t(o.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 焦段分类 */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {t('filters.focalLength')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FOCAL_RANGES.map((f) => {
            const isSelected = filters.focalCategories.includes(f.key);
            return (
              <button
                key={f.key}
                onClick={() => onToggleFocalCategory(f.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{t(f.labelKey)}</span>
                <span className="text-[10px] opacity-75 font-mono">{f.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. 最大光圈 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('filters.aperture')}
          </label>
          <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
            {filters.maxApertureMax >= 8.0 ? t('filters.unlimited') : `≤ F${filters.maxApertureMax.toFixed(1)}`}
          </span>
        </div>
        <input
          type="range"
          min="1.2"
          max="8.0"
          step="0.1"
          value={filters.maxApertureMax}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              maxApertureMax: parseFloat(e.target.value),
              preset: null,
            })
          }
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>F1.2</span>
          <span>F1.8</span>
          <span>F2.8</span>
          <span>F4.0</span>
          <span>{t('filters.unlimited')}</span>
        </div>
      </div>

      {/* 6. 滤镜口径 */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {t('filters.filterThread')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_THREADS.map((thread) => {
            const isSelected = filters.filterThread === thread;
            return (
              <button
                key={thread}
                onClick={() =>
                  onFilterChange({ ...filters, filterThread: thread, preset: null })
                }
                className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {thread === 'all' ? t('filters.allThreads') : `Φ${thread}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. 价格与重量滑块 */}
      <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        {/* 价格 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('filters.maxPrice')}</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {filters.priceMax >= 50000 ? t('filters.unlimited') : `≤ ¥${filters.priceMax.toLocaleString()}`}
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={filters.priceMax}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                priceMax: parseInt(e.target.value, 10),
                preset: null,
              })
            }
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* 重量 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Weight className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('filters.maxWeight')}</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {filters.weightMax >= 2500 ? t('filters.unlimited') : `≤ ${filters.weightMax} g`}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="2500"
            step="50"
            value={filters.weightMax}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                weightMax: parseInt(e.target.value, 10),
                preset: null,
              })
            }
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* 综合总分 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('filters.minScore')}</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              {filters.overallScoreMin === 0 ? t('filters.unlimited') : `≥ ${filters.overallScoreMin}`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="85"
            step="5"
            value={filters.overallScoreMin}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                overallScoreMin: parseInt(e.target.value, 10),
                preset: null,
              })
            }
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 8. 特殊徽章勾选 */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {t('filters.specialBadges')}
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={filters.isGMOnly}
              onChange={(e) =>
                onFilterChange({ ...filters, isGMOnly: e.target.checked, preset: null })
              }
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
            />
            <span>{t('filters.badgeOptions.gmOnly')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={filters.isGOnly}
              onChange={(e) =>
                onFilterChange({ ...filters, isGOnly: e.target.checked, preset: null })
              }
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
            />
            <span>{t('filters.badgeOptions.gOnly')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={filters.isMacroOnly}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  isMacroOnly: e.target.checked,
                  preset: null,
                })
              }
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
            />
            <span>{t('filters.badgeOptions.macroOnly')}</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* PC 桌面端侧边栏 */}
      {!isCollapsed && (
        <aside className="hidden lg:block w-72 shrink-0 bg-white dark:bg-[#131620] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain transition-all duration-300">
          {content}
        </aside>
      )}

      {/* 移动端抽屉 (Drawer) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#131620] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto overscroll-contain shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {t('filters.title')}
              </span>
              <button
                onClick={onMobileClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {content}
            <div className="sticky bottom-0 pt-3 bg-white dark:bg-[#131620] border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={onMobileClose}
                className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-transform"
              >
                {t('filters.done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
