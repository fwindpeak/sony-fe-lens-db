import { useState, useEffect } from 'react';
import { Lens } from '../types/lens';

const STORAGE_KEY = 'sony_lens_db_comparison_ids';
const MAX_COMPARE_COUNT = 4;

export function useComparison(allLenses: Lens[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const toggleCompare = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= MAX_COMPARE_COUNT) {
        // 如果达到上限，提示或替换最旧的一款
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const removeCompare = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const clearCompare = () => {
    setSelectedIds([]);
  };

  const isComparing = (id: string) => selectedIds.includes(id);

  const comparedLenses = selectedIds
    .map((id) => allLenses.find((lens) => lens.id === id))
    .filter((lens): lens is Lens => lens !== undefined);

  return {
    selectedIds,
    comparedLenses,
    isComparing,
    toggleCompare,
    removeCompare,
    clearCompare,
    isOpen,
    setIsOpen,
    maxCount: MAX_COMPARE_COUNT,
  };
}
