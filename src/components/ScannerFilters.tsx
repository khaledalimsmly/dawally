import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../hooks/useRTL';

interface ScannerFiltersProps {
  sectors: string[];
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  selectedRiskLevel: string;
  onRiskLevelChange: (risk: string) => void;
  resultsCount: number;
  onReset: () => void;
}

export const ScannerFilters = ({
  sectors,
  selectedSector,
  onSectorChange,
  selectedRiskLevel,
  onRiskLevelChange,
  resultsCount,
  onReset
}: ScannerFiltersProps) => {
  const { t } = useTranslation('scanner');
  const { isRTL } = useRTL();

  const riskLevels = ['All Risk Levels', 'Low', 'Medium', 'High'];

  const hasActiveFilters = selectedSector !== 'All Sectors' || selectedRiskLevel !== 'All Risk Levels';

  return (
    <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''} p-4 bg-gray-800/30 border border-gray-700 rounded-xl mb-6`}>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} text-gray-400`}>
        <Filter className="w-5 h-5" />
        <span className="font-medium">{t('filters.label')}</span>
      </div>

      <div className={`flex-1 flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">{t('filters.sector')}</label>
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">{t('filters.riskLevel')}</label>
          <select
            value={selectedRiskLevel}
            onChange={(e) => onRiskLevelChange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
          >
            {riskLevels.map((risk) => (
              <option key={risk} value={risk}>
                {risk}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors`}
          >
            <X className="w-4 h-4" />
            {t('filters.reset')}
          </button>
        )}
      </div>

      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-lg`}>
        <span className="text-sm text-gray-400">{t('filters.results')}</span>
        <span className="text-lg font-bold text-teal-400">{resultsCount}</span>
      </div>
    </div>
  );
};
