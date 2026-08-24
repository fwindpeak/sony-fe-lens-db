import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { SortField, SortDirection, ViewMode } from '../types/lens';

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  count: number;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionToggle,
  viewMode,
  onViewModeChange,
  count,
}) => {
  const { t } = useTranslation();

  const sortOptions: { field: SortField; labelKey: string }[] = [
    { field: 'overallScore', labelKey: 'sort.overallScoreDesc' },
    { field: 'valueScore', labelKey: 'sort.valueScoreDesc' },
    { field: 'portabilityScore', labelKey: 'sort.portabilityScoreDesc' },
    { field: 'sharpnessScore', labelKey: 'sort.sharpnessScoreDesc' },
    { field: 'priceCny', labelKey: 'sort.priceCnyAsc' },
    { field: 'weightG', labelKey: 'sort.weightGAsc' },
    { field: 'releaseDate', labelKey: 'sort.releaseDateDesc' },
    { field: 'focalMin', labelKey: 'sort.focalMinAsc' },
    { field: 'maxAperture', labelKey: 'sort.maxApertureAsc' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#131620] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 shadow-sm">
      {/* 排序选择区 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" />
          <span>{t('sort.label')}:</span>
        </div>
        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.field} value={opt.field}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>

        {/* 升降序切换 */}
        <button
          onClick={onSortDirectionToggle}
          title={sortDirection === 'asc' ? '升序' : '降序'}
          className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
        >
          {sortDirection === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-orange-500" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-orange-500" />
          )}
        </button>
      </div>

      {/* 视图切换 (Card vs Table) */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'grid'
              ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('app.views.grid')}</span>
        </button>
        <button
          onClick={() => onViewModeChange('table')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            viewMode === 'table'
              ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('app.views.table')}</span>
        </button>
      </div>
    </div>
  );
};
