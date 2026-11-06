import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  LayoutGrid,
  Table as TableIcon,
  PanelLeft,
} from 'lucide-react';
import { SortField, SortDirection, ViewMode, DEFAULT_SORT_DIRECTIONS } from '../types/lens';

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  onSortDirectionToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  count: number;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  activeFilterCount?: number;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortDirection,
  onSortChange,
  onSortDirectionToggle,
  viewMode,
  onViewModeChange,
  count,
  isSidebarCollapsed = false,
  onToggleSidebar,
  activeFilterCount = 0,
}) => {
  const { t } = useTranslation();

  const sortFieldsList: { field: SortField; defaultDirection: SortDirection }[] = [
    { field: 'releaseDate', defaultDirection: 'desc' },
    { field: 'overallScore', defaultDirection: 'desc' },
    { field: 'valueScore', defaultDirection: 'desc' },
    { field: 'portabilityScore', defaultDirection: 'desc' },
    { field: 'sharpnessScore', defaultDirection: 'desc' },
    { field: 'priceCny', defaultDirection: 'asc' },
    { field: 'weightG', defaultDirection: 'asc' },
    { field: 'focalMin', defaultDirection: 'asc' },
    { field: 'maxAperture', defaultDirection: 'asc' },
  ];

  const getOptionLabel = (field: SortField, defaultDirection: SortDirection) => {
    const isCurrentField = sortField === field;
    const direction = isCurrentField ? sortDirection : defaultDirection;
    const key = `sort.${field}${direction === 'asc' ? 'Asc' : 'Desc'}`;
    return t(key);
  };

  const handleSelectField = (newField: SortField) => {
    const defaultDir = DEFAULT_SORT_DIRECTIONS[newField] || 'desc';
    onSortChange(newField, defaultDir);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white dark:bg-[#131620] border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-2 sm:p-3 shadow-sm">
      {/* 左侧：侧边栏展开/收起按钮 (PC) + 排序选择区 */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? t('filters.expand') : t('filters.collapse')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSidebarCollapsed
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30'
            }`}
          >
            <PanelLeft className="w-3.5 h-3.5 text-orange-500" />
            <span>{isSidebarCollapsed ? t('filters.expand') : t('filters.collapse')}</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500 text-white font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" />
          <span className="hidden xs:inline">{t('sort.label')}:</span>
        </div>
        <select
          value={sortField}
          onChange={(e) => handleSelectField(e.target.value as SortField)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-medium rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
        >
          {sortFieldsList.map((item) => (
            <option key={item.field} value={item.field}>
              {getOptionLabel(item.field, item.defaultDirection)}
            </option>
          ))}
        </select>

        {/* 升降序切换 */}
        <button
          onClick={onSortDirectionToggle}
          title={sortDirection === 'asc' ? '当前升序 (点击切换为降序)' : '当前降序 (点击切换为升序)'}
          className="p-1 sm:p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors shrink-0"
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
