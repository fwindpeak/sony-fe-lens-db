import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

interface QuickPresetsProps {
  activePreset: string | null;
  onSelectPreset: (presetKey: string | null) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({
  activePreset,
  onSelectPreset,
}) => {
  const { t } = useTranslation();

  const presets = [
    { key: 'all', label: t('presets.all') },
    { key: 'trinityHoly', label: t('presets.trinityHoly') },
    { key: 'portrait', label: t('presets.portrait') },
    { key: 'street', label: t('presets.street') },
    { key: 'landscape', label: t('presets.landscape') },
    { key: 'valueKing', label: t('presets.valueKing') },
    { key: 'birding', label: t('presets.birding') },
    { key: 'macro', label: t('presets.macro') },
    { key: 'sonyGM', label: t('presets.sonyGM') },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 min-w-max">
        <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 pl-1 pr-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('presets.label')}</span>
        </div>
        {presets.map((p) => {
          const isActive =
            (p.key === 'all' && !activePreset) || activePreset === p.key;

          return (
            <button
              key={p.key}
              onClick={() => onSelectPreset(p.key === 'all' ? null : p.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/30'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-orange-500/50 hover:bg-orange-500/5'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
