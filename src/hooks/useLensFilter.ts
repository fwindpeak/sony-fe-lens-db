import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import {
  Lens,
  FilterState,
  SortField,
  SortDirection,
  FocalCategory,
} from '../types/lens';

const initialFilterState: FilterState = {
  search: '',
  brandCategory: 'all',
  type: 'all',
  focusType: 'all',
  hasOSS: 'all',
  focalCategories: [],
  maxApertureMin: 0.95,
  maxApertureMax: 8.0,
  priceMin: 0,
  priceMax: 100000,
  weightMin: 0,
  weightMax: 3500,
  overallScoreMin: 0,
  isMacroOnly: false,
  isGMOnly: false,
  isGOnly: false,
  filterThread: 'all',
  preset: null,
};

export function useLensFilter(allLenses: Lens[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sortField, setSortField] = useState<SortField>('overallScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // 构建 Fuse.js 模糊搜索引擎
  const fuse = useMemo(() => {
    return new Fuse(allLenses, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'brandZh', weight: 0.2 },
        { name: 'brandEn', weight: 0.2 },
        { name: 'focalDesc', weight: 0.3 },
        { name: 'apertureDesc', weight: 0.2 },
        { name: 'filterThread', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      useExtendedSearch: true,
    });
  }, [allLenses]);

  // 处理快捷预设切换
  const applyPreset = (presetKey: string | null) => {
    if (!presetKey || presetKey === 'all') {
      setFilters(initialFilterState);
      return;
    }

    const nextFilters: FilterState = {
      ...initialFilterState,
      preset: presetKey,
    };

    switch (presetKey) {
      case 'trinityHoly': // 大三元/小三元: 16-35, 24-70, 70-200 或类似变焦
        nextFilters.type = '变焦';
        break;
      case 'street': // 轻便挂机扫街: 重量 < 350g, 焦段偏广角/标准
        nextFilters.weightMax = 350;
        break;
      case 'portrait': // 人像虚化神器: 大光圈 (<=1.4) 或 中远摄 85/135
        nextFilters.focalCategories = ['telephoto'];
        nextFilters.maxApertureMax = 1.8;
        break;
      case 'landscape': // 风光超广利器: <=24mm
        nextFilters.focalCategories = ['ultra-wide'];
        break;
      case 'valueKing': // 极致性价比: 性价比 >= 50
        break;
      case 'birding': // 生态打鸟长焦: >=200mm
        nextFilters.focalCategories = ['super-telephoto'];
        break;
      case 'macro': // 微距特写
        nextFilters.isMacroOnly = true;
        break;
      case 'sonyGM': // 索尼原厂 GM
        nextFilters.isGMOnly = true;
        break;
    }

    setFilters(nextFilters);
  };

  // 多维过滤与搜索
  const filteredLenses = useMemo(() => {
    let result = allLenses;

    // 1. 搜索关键词
    if (filters.search.trim()) {
      const searchTerms = filters.search.trim();
      const searchResults = fuse.search(searchTerms);
      result = searchResults.map((item) => item.item);
    }

    // 2. 预设附加逻辑过滤
    if (filters.preset === 'trinityHoly') {
      result = result.filter(
        (lens) =>
          lens.type === '变焦' &&
          (lens.focalDesc.includes('16-35') ||
            lens.focalDesc.includes('24-70') ||
            lens.focalDesc.includes('70-200') ||
            lens.focalDesc.includes('28-75') ||
            lens.focalDesc.includes('17-28') ||
            lens.focalDesc.includes('70-180') ||
            lens.focalDesc.includes('14-24') ||
            lens.focalDesc.includes('24-105'))
      );
    } else if (filters.preset === 'valueKing') {
      result = result.filter((lens) => lens.valueScore >= 45);
    }

    // 3. 品牌筛选
    if (filters.brandCategory !== 'all') {
      result = result.filter((lens) => lens.brandCategory === filters.brandCategory);
    }

    // 4. 镜头类型
    if (filters.type !== 'all') {
      result = result.filter((lens) => lens.type === filters.type);
    }

    // 5. 对焦方式
    if (filters.focusType === 'af') {
      result = result.filter((lens) => lens.isAF);
    } else if (filters.focusType === 'mf') {
      result = result.filter((lens) => !lens.isAF);
    }

    // 6. 光学防抖
    if (filters.hasOSS === 'yes') {
      result = result.filter((lens) => lens.hasOSS);
    } else if (filters.hasOSS === 'no') {
      result = result.filter((lens) => !lens.hasOSS);
    }

    // 7. 焦段分类
    if (filters.focalCategories.length > 0) {
      result = result.filter((lens) =>
        lens.focalCategory.some((cat) => filters.focalCategories.includes(cat))
      );
    }

    // 8. 最大光圈
    if (filters.maxApertureMax < 8.0) {
      result = result.filter((lens) => lens.maxAperture <= filters.maxApertureMax);
    }

    // 9. 价格区间
    if (filters.priceMin > 0 || filters.priceMax < 100000) {
      result = result.filter(
        (lens) =>
          lens.priceCny >= filters.priceMin && lens.priceCny <= filters.priceMax
      );
    }

    // 10. 重量区间
    if (filters.weightMin > 0 || filters.weightMax < 3500) {
      result = result.filter(
        (lens) =>
          lens.weightG >= filters.weightMin && lens.weightG <= filters.weightMax
      );
    }

    // 11. 综合光学总分
    if (filters.overallScoreMin > 0) {
      result = result.filter((lens) => lens.overallScore >= filters.overallScoreMin);
    }

    // 12. 特殊徽章
    if (filters.isMacroOnly) {
      result = result.filter((lens) => lens.isMacro);
    }
    if (filters.isGMOnly) {
      result = result.filter((lens) => lens.isGM);
    }
    if (filters.isGOnly) {
      result = result.filter((lens) => lens.isG);
    }

    // 13. 滤镜口径
    if (filters.filterThread !== 'all') {
      result = result.filter(
        (lens) => lens.filterThread === filters.filterThread || lens.filterThread.startsWith(filters.filterThread)
      );
    }

    return result;
  }, [allLenses, filters, fuse]);

  // 排序
  const sortedLenses = useMemo(() => {
    return [...filteredLenses].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // 日期排序特殊处理 (如 "2024.4")
      if (sortField === 'releaseDate') {
        const parseDate = (d: string) => {
          if (!d) return 0;
          const [year, month] = d.split('.').map(Number);
          return (year || 0) * 100 + (month || 0);
        };
        valA = parseDate(a.releaseDate);
        valB = parseDate(b.releaseDate);
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      // 次级排序按综合分倒序
      return b.overallScore - a.overallScore;
    });
  }, [filteredLenses, sortField, sortDirection]);

  // 统计数据
  const stats = useMemo(() => {
    const count = sortedLenses.length;
    if (count === 0) return { count: 0, avgPrice: 0, avgWeight: 0, avgScore: 0 };

    const validPriceLenses = sortedLenses.filter((l) => l.priceCny > 0);
    const totalPrice = validPriceLenses.reduce((sum, l) => sum + l.priceCny, 0);
    const avgPrice = validPriceLenses.length > 0 ? Math.round(totalPrice / validPriceLenses.length) : 0;

    const validWeightLenses = sortedLenses.filter((l) => l.weightG > 0);
    const totalWeight = validWeightLenses.reduce((sum, l) => sum + l.weightG, 0);
    const avgWeight = validWeightLenses.length > 0 ? Math.round(totalWeight / validWeightLenses.length) : 0;

    const totalScore = sortedLenses.reduce((sum, l) => sum + l.overallScore, 0);
    const avgScore = Number((totalScore / count).toFixed(1));

    return { count, avgPrice, avgWeight, avgScore };
  }, [sortedLenses]);

  // 计算当前生效的过滤条件数量
  const activeFilterCount = useMemo(() => {
    let cnt = 0;
    if (filters.search.trim()) cnt++;
    if (filters.brandCategory !== 'all') cnt++;
    if (filters.type !== 'all') cnt++;
    if (filters.focusType !== 'all') cnt++;
    if (filters.hasOSS !== 'all') cnt++;
    if (filters.focalCategories.length > 0) cnt += filters.focalCategories.length;
    if (filters.maxApertureMax < 8.0) cnt++;
    if (filters.priceMax < 50000) cnt++;
    if (filters.weightMax < 2500) cnt++;
    if (filters.overallScoreMin > 0) cnt++;
    if (filters.isGMOnly) cnt++;
    if (filters.isGOnly) cnt++;
    if (filters.isMacroOnly) cnt++;
    if (filters.filterThread !== 'all') cnt++;
    return cnt;
  }, [filters]);

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  const toggleFocalCategory = (category: FocalCategory) => {
    setFilters((prev) => {
      const exists = prev.focalCategories.includes(category);
      const nextCats = exists
        ? prev.focalCategories.filter((c) => c !== category)
        : [...prev.focalCategories, category];
      return { ...prev, focalCategories: nextCats, preset: null };
    });
  };

  return {
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
  };
}
