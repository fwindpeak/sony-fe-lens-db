import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onOpenMobileFilters?: () => void;
  filteredCount: number;
  totalCount: number;
  avgPrice: number;
  avgWeight: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onOpenMobileFilters,
  filteredCount,
  totalCount,
  avgPrice,
  avgWeight,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-3">
      {/* 搜索框与移动端筛选触发按钮 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('app.searchPlaceholder')}
            className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={t('app.clearSearch')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 移动端筛选按钮 */}
        {onOpenMobileFilters && (
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1 px-3 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-colors shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{t('filters.filterBtn')}</span>
          </button>
        )}
      </div>

      {/* 统计条 */}
      <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 px-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {t('app.filteredCount', { count: filteredCount })}
          </span>
          {filteredCount < totalCount && (
            <span className="text-slate-400 text-[10px] sm:text-xs">
              / {t('app.totalLensesInDb', { count: totalCount })}
            </span>
          )}
        </div>

        {filteredCount > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {avgPrice > 0 && (
              <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono">
                {t('app.averagePrice', { price: avgPrice.toLocaleString() })}
              </span>
            )}
            {avgWeight > 0 && (
              <span className="hidden xs:inline-block bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono">
                {t('app.averageWeight', { weight: avgWeight })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
