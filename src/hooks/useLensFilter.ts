import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import {
  Lens,
  FilterState,
  SortField,
  SortDirection,
  FocalCategory,
} from '../types/lens';
import { defaultFilterState, parseStateFromUrl } from '../utils/urlState';

export function useLensFilter(allLenses: Lens[]) {
  const [filters, setFilters] = useState<FilterState>(() => {
    return parseStateFromUrl().filters;
  });
  const [sortField, setSortField] = useState<SortField>(() => {
    return parseStateFromUrl().sortField;
  });
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    return parseStateFromUrl().sortDirection;
  });

  // 构建 Fuse.js 模糊搜索引擎作为打底
  const fuse = useMemo(() => {
    return new Fuse(allLenses, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'officialUrl', weight: 0.35 },
        { name: 'brandZh', weight: 0.25 },
        { name: 'brandEn', weight: 0.25 },
        { name: 'focalDesc', weight: 0.35 },
        { name: 'apertureDesc', weight: 0.2 },
        { name: 'filterThread', weight: 0.1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    });
  }, [allLenses]);

  // 处理快捷预设切换
  const applyPreset = (presetKey: string | null) => {
    if (!presetKey || presetKey === 'all') {
      setFilters(defaultFilterState);
      return;
    }

    const nextFilters: FilterState = {
      ...defaultFilterState,
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
  const { filteredLenses, searchScoreMap } = useMemo(() => {
    let result = allLenses;
    const scoreMap = new Map<string, number>();

    // 1. 搜索关键词匹配与多维打分
    if (filters.search.trim()) {
      const rawQ = filters.search.trim();
      const lowerQ = rawQ.toLowerCase();
      const cleanQ = lowerQ.replace(/mm$/i, '').replace(/^f/i, '').trim();
      const noSpaceQ = lowerQ.replace(/[\s\-_/]/g, '');

      // 提取纯焦段数字 (如 "85", "85mm", "85 mm")
      const pureFocalMatch = lowerQ.match(/^([0-9]{2,3})\s*(mm)?$/i);
      // 提取变焦区间 (如 "24-70", "70-200", "24-70mm")
      const zoomFocalMatch = lowerQ.match(/^([0-9]{2,3})\s*[-~至到/]\s*([0-9]{2,3})\s*(mm)?$/i);

      // 中英文/数字边界智能分词: 如 "适马85" => "适马 85", "85mm1.4" => "85mm 1.4"
      const expandedQ = rawQ
        .replace(/([\u4e00-\u9fa5]+)([0-9a-zA-Z])/g, '$1 $2')
        .replace(/([0-9a-zA-Z])([\u4e00-\u9fa5]+)/g, '$1 $2')
        .replace(/[/_]/g, ' ')
        .toLowerCase();

      const tokens = expandedQ.split(/\s+/).filter(Boolean);

      // 基于全库进行精准度与语义打分
      for (const lens of allLenses) {
        let score = 0;
        const urlModelCode = (lens.officialUrl || '').split('/').filter(Boolean).pop()?.replace(/\.html$/i, '').toLowerCase() || '';
        const bZh = (lens.brandZh || '').toLowerCase();
        const bEn = (lens.brandEn || '').toLowerCase();
        const name = (lens.name || '').toLowerCase();
        const focalDesc = (lens.focalDesc || '').toLowerCase();
        const cleanFocal = focalDesc.replace('mm', '').trim();
        const apertureDesc = (lens.apertureDesc || '').toLowerCase();

        const fullCombined = `${bZh} ${bEn} ${name} ${focalDesc} ${apertureDesc} ${urlModelCode} ${lens.officialUrl || ''}`.toLowerCase();
        const noSpaceFull = fullCombined.replace(/[\s\-_/]/g, '');

        // 1. 官方型号代码精准匹配 (如 "sel35f18f", "sel2470gm2", "a063", "f050", "sel85f14gm")
        if (urlModelCode && (urlModelCode === noSpaceQ || urlModelCode === lowerQ)) {
          score += 10000 + lens.overallScore;
        } else if (urlModelCode && (urlModelCode.includes(noSpaceQ) || (noSpaceQ.length >= 4 && noSpaceQ.includes(urlModelCode)))) {
          score += 6000 + lens.overallScore;
        }

        // 2. 纯数字焦段查询 (如 "85" 或 "85mm")
        if (pureFocalMatch) {
          const targetF = parseInt(pureFocalMatch[1], 10);
          if (lens.focalMin === targetF && lens.focalMax === targetF) {
            score += 5000 + lens.overallScore; // 85定焦头独得超高分，排在最前面
          } else if (lens.focalMin <= targetF && lens.focalMax >= targetF) {
            score += 800 + lens.overallScore; // 覆盖该焦段的变焦头
          }
        } else if (zoomFocalMatch) {
          const minF = parseInt(zoomFocalMatch[1], 10);
          const maxF = parseInt(zoomFocalMatch[2], 10);
          if (lens.focalMin === minF && lens.focalMax === maxF) {
            score += 6000 + lens.overallScore; // 变焦区间完全吻合
          } else if (lens.focalMin <= minF && lens.focalMax >= maxF) {
            score += 1000 + lens.overallScore;
          }
        }

        // 3. 整串直接包含 (如 "适马85", "85 1.4", "FE 85", "sel35")
        if (noSpaceFull.includes(noSpaceQ)) {
          score += 2000;
          if (noSpaceFull.startsWith(noSpaceQ)) {
            score += 500;
          }
        }

        // 4. 多分词联合命中 (如 "适马 85 1.4", "sel 35 1.8", "sel 50 1.2")
        let allTokensMatch = true;
        let matchedCount = 0;

        for (const token of tokens) {
          const cleanToken = token.replace(/mm$/i, '').replace(/^f/i, '');
          const numToken = parseInt(cleanToken, 10);
          const isFocalToken =
            cleanFocal === cleanToken ||
            focalDesc === token ||
            (numToken > 0 && lens.focalMin <= numToken && lens.focalMax >= numToken);
          const isBrandMatch =
            bZh.includes(token) ||
            bEn.includes(token) ||
            ((token === 'sel' || token === 'fe') && (lens.brandCategory === 'sony' || bZh.includes('索尼')));
          const isNameMatch = name.includes(token) || (cleanToken && name.includes(cleanToken));
          const isApertureMatch = apertureDesc.includes(token) || (cleanToken && apertureDesc.includes(cleanToken));
          const isModelMatch = urlModelCode.includes(token) || (cleanToken && urlModelCode.includes(cleanToken));
          const isFullMatch = fullCombined.includes(token) || (cleanToken && fullCombined.includes(cleanToken));

          if (isFocalToken || isBrandMatch || isNameMatch || isApertureMatch || isModelMatch || isFullMatch) {
            matchedCount++;
            score += 300;
            if (cleanFocal === cleanToken) score += 1000;
            if (isBrandMatch) score += 500;
            if (isModelMatch) score += 800;
            if (isApertureMatch) score += 300;
          } else {
            allTokensMatch = false;
          }
        }

        if (allTokensMatch && tokens.length > 1) {
          score += 1200;
        }

        if (score > 0 && (allTokensMatch || matchedCount === tokens.length || noSpaceFull.includes(noSpaceQ))) {
          scoreMap.set(lens.id, score);
        }
      }

      // 4. Fuse.js 模糊匹配作为容错补充 (处理拼写笔误等)
      const fuseResults = fuse.search(rawQ);
      for (const item of fuseResults) {
        const existing = scoreMap.get(item.item.id) || 0;
        const fuseBoost = Math.max(0, Math.round((1 - (item.score || 0)) * 400));
        scoreMap.set(item.item.id, existing + fuseBoost);
      }

      result = result.filter((lens) => scoreMap.has(lens.id));
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

    // 8. 精确焦段范围 (滑块)
    if (filters.focalLengthMin > 8 || filters.focalLengthMax < 800) {
      result = result.filter(
        (lens) =>
          lens.focalMax >= filters.focalLengthMin &&
          lens.focalMin <= filters.focalLengthMax
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

    return { filteredLenses: result, searchScoreMap: scoreMap };
  }, [allLenses, filters, fuse]);

  // 排序
  const sortedLenses = useMemo(() => {
    const isSearching = !!filters.search.trim();

    return [...filteredLenses].sort((a, b) => {
      // 搜索状态下，默认按搜索相关度得分优先排序
      if (isSearching && sortField === 'overallScore') {
        const scoreA = searchScoreMap.get(a.id) || 0;
        const scoreB = searchScoreMap.get(b.id) || 0;
        if (scoreA !== scoreB) {
          return sortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
        }
      }

      let valA: string | number = a[sortField] ?? 0;
      let valB: string | number = b[sortField] ?? 0;

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
      // 次级排序按综合分倒序，再按原始索引保证稳定排序
      if (b.overallScore !== a.overallScore) {
        return b.overallScore - a.overallScore;
      }
      return a.index - b.index;
    });
  }, [filteredLenses, searchScoreMap, sortField, sortDirection, filters.search]);

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
    if (filters.focalLengthMin > 8 || filters.focalLengthMax < 800) cnt++;
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
    setFilters(defaultFilterState);
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
