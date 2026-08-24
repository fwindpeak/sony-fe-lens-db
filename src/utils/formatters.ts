export function formatPrice(price: number): string {
  if (!price || price <= 0) return '待定';
  return price.toLocaleString('zh-CN');
}

export function formatWeight(weight: number): string {
  if (!weight || weight <= 0) return '-';
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(2)} kg`;
  }
  return `${weight} g`;
}

export function formatLength(length: number): string {
  if (!length || length <= 0) return '-';
  return `${length} mm`;
}

export function getScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  fill: string;
} {
  if (score >= 85) {
    return {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30',
      fill: '#f59e0b',
    };
  }
  if (score >= 75) {
    return {
      bg: 'bg-orange-500/10 dark:bg-orange-500/20',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/30',
      fill: '#FF5A00',
    };
  }
  if (score >= 65) {
    return {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/30',
      fill: '#3b82f6',
    };
  }
  if (score >= 50) {
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      fill: '#10b981',
    };
  }
  return {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-500/30',
    fill: '#64748b',
  };
}
