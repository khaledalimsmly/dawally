import { Volume2, Activity, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRTL } from '../hooks/useRTL';

type TabType = 'volume' | 'volatility' | 'sentiment';

interface ScannerTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  volumeCount: number;
  volatilityCount: number;
  sentimentCount: number;
}

export const ScannerTabs = ({
  activeTab,
  onTabChange,
  volumeCount,
  volatilityCount,
  sentimentCount
}: ScannerTabsProps) => {
  const { t } = useTranslation('scanner');
  const { isRTL } = useRTL();

  const tabs = [
    {
      id: 'volume' as TabType,
      label: t('tabs.volume'),
      icon: Volume2,
      count: volumeCount,
      color: 'orange'
    },
    {
      id: 'volatility' as TabType,
      label: t('tabs.volatility'),
      icon: Activity,
      count: volatilityCount,
      color: 'blue'
    },
    {
      id: 'sentiment' as TabType,
      label: t('tabs.sentiment'),
      icon: Zap,
      count: sentimentCount,
      color: 'yellow'
    }
  ];

  const getTabColors = (color: string, isActive: boolean) => {
    if (!isActive) {
      return 'text-gray-400 border-gray-700';
    }

    switch (color) {
      case 'orange':
        return 'text-orange-400 border-orange-500';
      case 'blue':
        return 'text-blue-400 border-blue-500';
      case 'yellow':
        return 'text-yellow-400 border-yellow-500';
      default:
        return 'text-teal-400 border-teal-500';
    }
  };

  return (
    <div className={`flex gap-2 border-b border-gray-700 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const colors = getTabColors(tab.color, isActive);

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} px-6 py-3 border-b-2 transition-all duration-200 ${
              isActive
                ? `${colors} font-semibold`
                : `${colors} hover:text-gray-300 hover:border-gray-600`
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
