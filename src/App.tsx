import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import rawLensesData from './data/lenses.json';
import { Lens, ViewMode } from './types/lens';
import { useLensFilter } from './hooks/useLensFilter';
import { useComparison } from './hooks/useComparison';
import { Header } from './components/Header';
import { QuickPresets } from './components/QuickPresets';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { SortControls } from './components/SortControls';
import { LensGrid } from './components/LensGrid';
import { LensTable } from './components/LensTable';
import { LensDetailModal } from './components/LensDetailModal';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { Info, ExternalLink } from 'lucide-react';
import { parseStateFromUrl, serializeStateToUrl, updateBrowserUrl } from './utils/urlState';

const allLenses: Lens[] = rawLensesData as Lens[];

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return parseStateFromUrl().viewMode;
  });
  const [detailLens, setDetailLens] = useState<Lens | null>(() => {
    const urlState = parseStateFromUrl();
    if (urlState.detailLensId) {
      return allLenses.find((l) => l.id === urlState.detailLensId) || null;
    }
    return null;
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sony_lens_db_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sony_lens_db_sidebar_collapsed', String(next));
      return next;
    });
  };

  const {
    filters,
    setFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    sortedLenses,
    stats,
    activeFilterCount,
    resetFilters,
    applyPreset,
    toggleFocalCategory,
  } = useLensFilter(allLenses);

  const {
    comparedLenses,
    isComparing,
    toggleCompare,
    removeCompare,
    clearCompare,
    isOpen: isCompareDrawerOpen,
    setIsOpen: setIsCompareDrawerOpen,
  } = useComparison(allLenses);

  // 1. 同步当前所有筛选、排序、视图及详情弹窗到 URL Query 参数
  React.useEffect(() => {
    const queryString = serializeStateToUrl({
      filters,
      sortField,
      sortDirection,
      viewMode,
      detailLensId: detailLens?.id || null,
      compareIds: comparedLenses.map((l) => l.id),
    });
    updateBrowserUrl(queryString);
  }, [filters, sortField, sortDirection, viewMode, detailLens, comparedLenses]);

  // 2. 监听浏览器前进/后退 (popstate) 触发的状态回退
  React.useEffect(() => {
    const handlePopState = () => {
      const parsed = parseStateFromUrl();
      setFilters(parsed.filters);
      setSortField(parsed.sortField);
      setSortDirection(parsed.sortDirection);
      setViewMode(parsed.viewMode);
      if (parsed.detailLensId) {
        setDetailLens(allLenses.find((l) => l.id === parsed.detailLensId) || null);
      } else {
        setDetailLens(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setFilters, setSortField, setSortDirection]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#0b0d13] dark:text-slate-100 transition-colors duration-200">
      {/* 顶部 Header */}
      <Header totalCount={allLenses.length} />

      {/* 主体区域 */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 顶部一键场景推荐栏 */}
        <QuickPresets
          activePreset={filters.preset}
          onSelectPreset={applyPreset}
        />

        {/* 搜索与全局统计条 */}
        <SearchBar
          value={filters.search}
          onChange={(val) => setFilters({ ...filters, search: val, preset: null })}
          onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
          filteredCount={stats.count}
          totalCount={allLenses.length}
          avgPrice={stats.avgPrice}
          avgWeight={stats.avgWeight}
        />

        {/* 下方双栏布局：左侧筛选器 + 右侧展示区 */}
        <div className="flex gap-6 items-start">
          {/* 左侧筛选侧边栏 (PC 端固定/可收起，移动端抽屉) */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            onToggleFocalCategory={toggleFocalCategory}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          {/* 右侧列表区域 */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* 排序控制与视图切换 */}
            <SortControls
              sortField={sortField}
              sortDirection={sortDirection}
              onSortFieldChange={setSortField}
              onSortDirectionToggle={() =>
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              count={sortedLenses.length}
              isSidebarCollapsed={isSidebarCollapsed}
              onToggleSidebar={toggleSidebar}
              activeFilterCount={activeFilterCount}
            />

            {/* 镜头列表展示：卡片网格 vs 数据表格 */}
            {viewMode === 'grid' ? (
              <LensGrid
                lenses={sortedLenses}
                onOpenDetail={(lens) => setDetailLens(lens)}
                isComparing={isComparing}
                onToggleCompare={toggleCompare}
                onResetFilters={resetFilters}
              />
            ) : (
              <LensTable
                lenses={sortedLenses}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={(field) => {
                  if (sortField === field) {
                    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                  } else {
                    setSortField(field);
                    setSortDirection('desc');
                  }
                }}
                onOpenDetail={(lens) => setDetailLens(lens)}
                isComparing={isComparing}
                onToggleCompare={toggleCompare}
              />
            )}
          </div>
        </div>
      </main>

      {/* 底部 Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* 数据免责声明提示框 */}
          <div className="flex items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 text-orange-800 dark:text-orange-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0 text-orange-500" />
              <span>{t('app.footer.disclaimer')}</span>
            </div>
            <a
              href="https://github.com/fwindpeak/sony-fe-lens-db/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400 hover:underline flex-shrink-0"
            >
              <span>{t('app.footer.reportIssue')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-slate-400 dark:text-slate-500">
            <div>
              {t('app.footer.copyright', { year: new Date().getFullYear() })}
            </div>
            <div className="flex items-center gap-4">
              <span>{t('app.footer.note')}</span>
              <span>·</span>
              <a
                href="https://github.com/fwindpeak/sony-fe-lens-db"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                {t('app.footer.github')}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 多镜头 PK 横向对比抽屉/弹窗 (z-50) */}
      <ComparisonDrawer
        comparedLenses={comparedLenses}
        onRemove={removeCompare}
        onClear={clearCompare}
        isOpen={isCompareDrawerOpen}
        onToggleOpen={() => setIsCompareDrawerOpen(!isCompareDrawerOpen)}
        onSelectLens={(lens) => setDetailLens(lens)}
      />

      {/* 镜头六维光学雷达图详情弹窗 (z-[60]，置于对比弹窗上层) */}
      <LensDetailModal
        lens={detailLens}
        onClose={() => setDetailLens(null)}
        isComparing={detailLens ? isComparing(detailLens.id) : false}
        onToggleCompare={(id) => toggleCompare(id)}
      />
    </div>
  );
};
