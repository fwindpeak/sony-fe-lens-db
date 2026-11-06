import type { FilterState, SortField, SortDirection, ViewMode, FocalCategory, BrandCategory } from '../types/lens';

export interface UrlSyncedState {
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  viewMode: ViewMode;
  detailLensId: string | null;
  compareIds: string[];
}

export const defaultFilterState: FilterState = {
  search: '',
  brandCategory: 'all',
  type: 'all',
  focusType: 'all',
  hasOSS: 'all',
  focalCategories: [],
  focalLengthMin: 8,
  focalLengthMax: 800,
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

const VALID_BRANDS: BrandCategory[] = [
  'sony',
  'sigma',
  'tamron',
  'zeiss',
  'samyang',
  'viltrox',
  'laowa',
  'voigtlander',
  'ttartisan',
  '7artisans',
  'yongnuo',
  'other',
];

const VALID_FOCAL_CATS: FocalCategory[] = [
  'ultra-wide',
  'wide',
  'standard',
  'telephoto',
  'super-telephoto',
];

const VALID_SORT_FIELDS: SortField[] = [
  'overallScore',
  'valueScore',
  'portabilityScore',
  'sharpnessScore',
  'priceCny',
  'weightG',
  'releaseDate',
  'focalMin',
  'maxAperture',
];

/**
 * 从当前 URL query 参数中解析状态
 */
export function parseStateFromUrl(searchStr: string = window.location.search): {
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  viewMode: ViewMode;
  detailLensId: string | null;
  compareIds: string[];
} {
  const params = new URLSearchParams(searchStr);
  const filters: FilterState = { ...defaultFilterState };

  // 1. 关键词搜索 (支持 q 或 search)
  const q = params.get('q') || params.get('search');
  if (q) {
    filters.search = q.trim();
  }

  // 2. 品牌
  const brand = params.get('brand');
  if (brand && VALID_BRANDS.includes(brand as BrandCategory)) {
    filters.brandCategory = brand as BrandCategory;
  }

  // 3. 类型 (定焦/变焦)
  const type = params.get('type');
  if (type === '定焦' || type === '变焦' || type === 'prime' || type === 'zoom') {
    filters.type = (type === 'prime' ? '定焦' : type === 'zoom' ? '变焦' : type) as '定焦' | '变焦';
  }

  // 4. 对焦方式 (af/mf)
  const focus = params.get('focus');
  if (focus === 'af' || focus === 'mf') {
    filters.focusType = focus;
  }

  // 5. 防抖 (yes/no)
  const oss = params.get('oss');
  if (oss === 'yes' || oss === 'no') {
    filters.hasOSS = oss;
  }

  // 6. 焦段分类 (focalCats / cats)
  const focalCatsStr = params.get('focalCats') || params.get('cats');
  if (focalCatsStr) {
    const cats = focalCatsStr
      .split(',')
      .map((c) => c.trim())
      .filter((c): c is FocalCategory => VALID_FOCAL_CATS.includes(c as FocalCategory));
    if (cats.length > 0) {
      filters.focalCategories = cats;
    }
  }

  // 7. 焦段滑块范围
  const fMin = parseFloat(params.get('focalMin') || '');
  if (!isNaN(fMin) && fMin >= 9 && fMin <= 800) {
    filters.focalLengthMin = fMin;
  }
  const fMax = parseFloat(params.get('focalMax') || '');
  if (!isNaN(fMax) && fMax >= 9 && fMax <= 800) {
    filters.focalLengthMax = fMax;
  }

  // 8. 光圈范围
  const apMin = parseFloat(params.get('apertureMin') || '');
  if (!isNaN(apMin) && apMin >= 0.95 && apMin <= 8.0) {
    filters.maxApertureMin = apMin;
  }
  const apMax = parseFloat(params.get('apertureMax') || '');
  if (!isNaN(apMax) && apMax >= 0.95 && apMax <= 8.0) {
    filters.maxApertureMax = apMax;
  }

  // 9. 价格区间
  const pMin = parseFloat(params.get('priceMin') || '');
  if (!isNaN(pMin) && pMin >= 0) {
    filters.priceMin = pMin;
  }
  const pMax = parseFloat(params.get('priceMax') || '');
  if (!isNaN(pMax) && pMax > 0) {
    filters.priceMax = pMax;
  }

  // 10. 重量区间
  const wMin = parseFloat(params.get('weightMin') || '');
  if (!isNaN(wMin) && wMin >= 0) {
    filters.weightMin = wMin;
  }
  const wMax = parseFloat(params.get('weightMax') || '');
  if (!isNaN(wMax) && wMax > 0) {
    filters.weightMax = wMax;
  }

  // 11. 最低评分
  const sMin = parseFloat(params.get('scoreMin') || '');
  if (!isNaN(sMin) && sMin > 0 && sMin <= 100) {
    filters.overallScoreMin = sMin;
  }

  // 12. 特殊标记 (macro, gm, g)
  if (params.get('macro') === '1' || params.get('macro') === 'true') {
    filters.isMacroOnly = true;
  }
  if (params.get('gm') === '1' || params.get('gm') === 'true') {
    filters.isGMOnly = true;
  }
  if (params.get('g') === '1' || params.get('g') === 'true') {
    filters.isGOnly = true;
  }

  // 13. 滤镜口径
  const thread = params.get('thread') || params.get('filterThread');
  if (thread && thread !== 'all') {
    filters.filterThread = thread;
  }

  // 14. 预设场景
  const preset = params.get('preset');
  if (preset) {
    filters.preset = preset;
  }

  // 15. 排序字段 (默认按上市发布时间最新到最晚)
  let sortField: SortField = 'releaseDate';
  const sortParam = params.get('sort');
  if (sortParam && VALID_SORT_FIELDS.includes(sortParam as SortField)) {
    sortField = sortParam as SortField;
  }

  // 16. 排序方向
  let sortDirection: SortDirection = 'desc';
  const orderParam = params.get('order');
  if (orderParam === 'asc' || orderParam === 'desc') {
    sortDirection = orderParam;
  }

  // 17. 视图模式 (grid / table)
  let viewMode: ViewMode = 'grid';
  const viewParam = params.get('view');
  if (viewParam === 'grid' || viewParam === 'table') {
    viewMode = viewParam;
  }

  // 18. 镜头详情弹窗 ID
  const detailLensId = params.get('lens') || null;

  // 19. 对比列表 IDs
  const compareParam = params.get('compare');
  const compareIds = compareParam
    ? compareParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return {
    filters,
    sortField,
    sortDirection,
    viewMode,
    detailLensId,
    compareIds,
  };
}

/**
 * 将当前状态序列化为精简的 URL 查询字符串
 */
export function serializeStateToUrl(state: {
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  viewMode: ViewMode;
  detailLensId?: string | null;
  compareIds?: string[];
}): string {
  const { filters, sortField, sortDirection, viewMode, detailLensId, compareIds } = state;
  const params = new URLSearchParams();

  // 1. 搜索词
  if (filters.search && filters.search.trim()) {
    params.set('q', filters.search.trim());
  }

  // 2. 预设场景
  if (filters.preset) {
    params.set('preset', filters.preset);
  }

  // 3. 品牌
  if (filters.brandCategory && filters.brandCategory !== 'all') {
    params.set('brand', filters.brandCategory);
  }

  // 4. 类型 (定焦/变焦)
  if (filters.type && filters.type !== 'all') {
    params.set('type', filters.type);
  }

  // 5. 对焦方式
  if (filters.focusType && filters.focusType !== 'all') {
    params.set('focus', filters.focusType);
  }

  // 6. 防抖
  if (filters.hasOSS && filters.hasOSS !== 'all') {
    params.set('oss', filters.hasOSS);
  }

  // 7. 焦段分类
  if (filters.focalCategories && filters.focalCategories.length > 0) {
    params.set('focalCats', filters.focalCategories.join(','));
  }

  // 8. 焦段数值
  if (filters.focalLengthMin > 9) {
    params.set('focalMin', String(filters.focalLengthMin));
  }
  if (filters.focalLengthMax < 800) {
    params.set('focalMax', String(filters.focalLengthMax));
  }

  // 9. 光圈数值
  if (filters.maxApertureMin > 0.95) {
    params.set('apertureMin', String(filters.maxApertureMin));
  }
  if (filters.maxApertureMax < 8.0) {
    params.set('apertureMax', String(filters.maxApertureMax));
  }

  // 10. 价格
  if (filters.priceMin > 0) {
    params.set('priceMin', String(filters.priceMin));
  }
  if (filters.priceMax < 100000) {
    params.set('priceMax', String(filters.priceMax));
  }

  // 11. 重量
  if (filters.weightMin > 0) {
    params.set('weightMin', String(filters.weightMin));
  }
  if (filters.weightMax < 3500) {
    params.set('weightMax', String(filters.weightMax));
  }

  // 12. 评分
  if (filters.overallScoreMin > 0) {
    params.set('scoreMin', String(filters.overallScoreMin));
  }

  // 13. 标签
  if (filters.isMacroOnly) {
    params.set('macro', '1');
  }
  if (filters.isGMOnly) {
    params.set('gm', '1');
  }
  if (filters.isGOnly) {
    params.set('g', '1');
  }

  // 14. 滤镜口径
  if (filters.filterThread && filters.filterThread !== 'all') {
    params.set('thread', filters.filterThread);
  }

  // 15. 排序 (默认 releaseDate desc 不写入参数)
  if (sortField !== 'releaseDate') {
    params.set('sort', sortField);
  }
  if (sortDirection !== 'desc') {
    params.set('order', sortDirection);
  }

  // 16. 视图模式
  if (viewMode !== 'grid') {
    params.set('view', viewMode);
  }

  // 17. 详情弹窗
  if (detailLensId) {
    params.set('lens', detailLensId);
  }

  // 18. 对比列表
  if (compareIds && compareIds.length > 0) {
    params.set('compare', compareIds.join(','));
  }

  return params.toString();
}

/**
 * 更新浏览器 URL 地址栏（无刷新 replaceState）
 */
export function updateBrowserUrl(queryString: string) {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const newUrl = queryString ? `${currentPath}?${queryString}${currentHash}` : `${currentPath}${currentHash}`;
  
  // 仅在 URL 确实发生改变时替换，避免无效 history 操作
  if (window.location.search !== (queryString ? `?${queryString}` : '')) {
    window.history.replaceState(null, '', newUrl);
  }
}
