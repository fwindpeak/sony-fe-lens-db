import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, Plus, Check, Eye } from 'lucide-react';
import { Lens, SortField, SortDirection } from '../types/lens';
import { formatPrice, formatWeight, getScoreColor } from '../utils/formatters';

interface LensTableProps {
  lenses: Lens[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onOpenDetail: (lens: Lens) => void;
  isComparing: (id: string) => boolean;
  onToggleCompare: (id: string) => void;
}

export const LensTable: React.FC<LensTableProps> = ({
  lenses,
  sortField,
  sortDirection,
  onSort,
  onOpenDetail,
  isComparing,
  onToggleCompare,
}) => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const renderSortHeader = (label: string, field: SortField, className = '') => {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => onSort(field)}
        className={`sticky top-0 z-20 bg-slate-100/95 dark:bg-[#161a27]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 py-3.5 px-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200/80 dark:hover:bg-slate-700/60 transition-colors select-none whitespace-nowrap ${className}`}
      >
        <div className="flex items-center gap-1">
          <span>{label}</span>
          <ArrowUpDown
            className={`w-3.5 h-3.5 ${
              isActive ? 'text-orange-500 font-bold' : 'text-slate-400 opacity-50'
            }`}
          />
        </div>
      </th>
    );
  };

  if (lenses.length === 0) {
    return (
      <div className="w-full py-16 px-4 bg-white dark:bg-[#131620] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-center text-slate-500 dark:text-slate-400">
        <p className="text-sm">{t('app.empty.title')}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[calc(100vh-13rem)] min-h-[480px] overflow-auto bg-white dark:bg-[#131620] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm relative">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 z-20">
          <tr className="border-b border-slate-200 dark:border-slate-700/80 bg-slate-100/95 dark:bg-[#161a27]/95 backdrop-blur-md shadow-sm">
            <th className="sticky top-0 z-20 bg-slate-100/95 dark:bg-[#161a27]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 py-3.5 px-3 text-xs font-bold text-slate-500 w-12 text-center">
              #
            </th>
            <th className="sticky top-0 z-20 bg-slate-100/95 dark:bg-[#161a27]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 py-3.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[220px]">
              {t('table.name')}
            </th>
            <th className="sticky top-0 z-20 bg-slate-100/95 dark:bg-[#161a27]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 py-3.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              {t('table.brand')}
            </th>
            {renderSortHeader(t('table.overall'), 'overallScore')}
            {renderSortHeader(t('table.sharpness'), 'sharpnessScore')}
            {renderSortHeader(t('table.value'), 'valueScore')}
            {renderSortHeader(t('table.focal'), 'focalMin')}
            {renderSortHeader(t('table.aperture'), 'maxAperture')}
            {renderSortHeader(t('table.weight'), 'weightG')}
            <th className="sticky top-0 z-20 bg-slate-100/95 dark:bg-[#161a27]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 py-3.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              {t('table.filter')}
            </th>
            {renderSortHeader(t('table.price'), 'priceCny')}
            {renderSortHeader(t('table.release'), 'releaseDate')}
            <th className="sticky top-0 z-20 bg-slate-100/95 dark:bg-[#161a27]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 py-3.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 text-center whitespace-nowrap">
              {t('table.action')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
          {lenses.map((lens, idx) => {
            const scoreStyle = getScoreColor(lens.overallScore);
            const inCompare = isComparing(lens.id);

            return (
              <tr
                key={lens.id}
                onClick={() => onOpenDetail(lens)}
                className="hover:bg-orange-500/5 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <td className="py-3 px-3 text-center text-slate-400 font-mono">
                  {idx + 1}
                </td>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-1.5">
                    {lens.isGM && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-600 text-white shrink-0">
                        GM
                      </span>
                    )}
                    {lens.isG && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-black shrink-0">
                        G
                      </span>
                    )}
                    <span className="hover:text-orange-500 transition-colors">
                      {lens.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {isZh ? lens.brandZh.split(' ')[0] : lens.brandEn}
                </td>
                <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded ${scoreStyle.bg} ${scoreStyle.text}`}>
                    {lens.overallScore.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-amber-500 font-bold whitespace-nowrap">
                  {lens.sharpnessStar}
                </td>
                <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {lens.valueScore}
                </td>
                <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {lens.focalDesc}
                </td>
                <td className="py-3 px-3 font-mono text-orange-600 dark:text-orange-400 font-semibold whitespace-nowrap">
                  {lens.apertureDesc}
                </td>
                <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {formatWeight(lens.weightG)}
                </td>
                <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                  {lens.filterThread && lens.filterThread !== '-'
                    ? `Φ${lens.filterThread}`
                    : '-'}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                  {lens.priceCny > 0 ? `¥${formatPrice(lens.priceCny)}` : '待定'}
                </td>
                <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                  {lens.releaseDate || '-'}
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onOpenDetail(lens)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="详情"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleCompare(lens.id)}
                      className={`p-1 rounded transition-colors ${
                        inCompare
                          ? 'bg-orange-500 text-white'
                          : 'text-slate-400 hover:text-orange-500'
                      }`}
                      title={inCompare ? '移出对比' : '加入对比'}
                    >
                      {inCompare ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
