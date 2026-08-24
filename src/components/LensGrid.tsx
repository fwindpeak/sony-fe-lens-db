import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Lens } from '../types/lens';
import { LensCard } from './LensCard';

interface LensGridProps {
  lenses: Lens[];
  onOpenDetail: (lens: Lens) => void;
  isComparing: (id: string) => boolean;
  onToggleCompare: (id: string) => void;
  onResetFilters: () => void;
}

const PAGE_SIZE = 24;

export const LensGrid: React.FC<LensGridProps> = ({
  lenses,
  onOpenDetail,
  isComparing,
  onToggleCompare,
  onResetFilters,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  // 当筛选变化导致结果减少时，重置回第1页
  useEffect(() => {
    setCurrentPage(1);
  }, [lenses.length]);

  const totalPages = Math.ceil(lenses.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentLenses = lenses.slice(startIndex, startIndex + PAGE_SIZE);

  if (lenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-[#131620] border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-center">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
          {t('app.empty.title')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          {t('app.empty.desc')}
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-orange-500/20 transition-all"
        >
          {t('app.resetAll')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 卡片响应式网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
        {currentLenses.map((lens) => (
          <LensCard
            key={lens.id}
            lens={lens}
            onOpenDetail={onOpenDetail}
            isComparing={isComparing(lens.id)}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>

      {/* 分页控制栏 */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t('app.pagination.displaying', {
              start: startIndex + 1,
              end: Math.min(startIndex + PAGE_SIZE, lenses.length),
              total: lenses.length,
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title={t('app.pagination.first')}
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title={t('app.pagination.prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title={t('app.pagination.next')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title={t('app.pagination.last')}
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
