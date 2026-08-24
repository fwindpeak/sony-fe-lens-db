import React, { useState } from 'react';
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

const allLenses: Lens[] = rawLensesData as Lens[];

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [detailLens, setDetailLens] = useState<Lens | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const {
    filters,
    setFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    sortedLenses,
    stats,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#0b0d13] dark:text-slate-100 transition-colors duration-200">
      {/* 顶部 Header */}
      <Header totalCount={allLenses.length} />

      {/* 主体区域 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
          {/* 左侧筛选侧边栏 (PC 端固定，移动端抽屉) */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            onToggleFocalCategory={toggleFocalCategory}
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
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Sony FE Lens Database © {new Date().getFullYear()} · 纯前端静态驱动 · 收录 480+ 款全画幅 E 卡口镜头
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            实验室 MTF 与几何综合标定评分
          </div>
        </div>
      </footer>

      {/* 镜头六维光学雷达图详情弹窗 */}
      <LensDetailModal
        lens={detailLens}
        onClose={() => setDetailLens(null)}
        isComparing={detailLens ? isComparing(detailLens.id) : false}
        onToggleCompare={(id) => toggleCompare(id)}
      />

      {/* 多镜头 PK 横向对比抽屉 */}
      <ComparisonDrawer
        comparedLenses={comparedLenses}
        onRemove={removeCompare}
        onClear={clearCompare}
        isOpen={isCompareDrawerOpen}
        onToggleOpen={() => setIsCompareDrawerOpen(!isCompareDrawerOpen)}
      />
    </div>
  );
};
