import { useState } from 'react';
import { ArrowUpDown, Trophy } from 'lucide-react';
import { Card, Badge } from './index';
import { getModelTypeLabel, getModelTypeColor } from '../lib/modelService';
import { useRTL } from '../hooks/useRTL';
import type { MockModelData } from '../lib/mockModelData';

interface ModelsComparisonTableProps {
  models: MockModelData[];
  bestModelId: string;
}

type SortField = 'name' | 'accuracy' | 'confidence' | 'risk';
type SortDirection = 'asc' | 'desc';

export const ModelsComparisonTable = ({ models, bestModelId }: ModelsComparisonTableProps) => {
  const { isRTL } = useRTL();
  const [sortField, setSortField] = useState<SortField>('accuracy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedModels = [...models].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'accuracy':
        aValue = a.accuracy;
        bValue = b.accuracy;
        break;
      case 'confidence':
        aValue = (a.confidenceRange.min + a.confidenceRange.max) / 2;
        bValue = (b.confidenceRange.min + b.confidenceRange.max) / 2;
        break;
      case 'risk':
        const riskOrder = { Low: 1, Medium: 2, High: 3 };
        aValue = riskOrder[a.riskLevel];
        bValue = riskOrder[b.riskLevel];
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-teal-400 transition-colors"
    >
      {label}
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );

  return (
    <>
      <div className="hidden lg:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                    <SortButton field="name" label="Model Name" />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                    Type
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                    <SortButton field="accuracy" label="Accuracy" />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                    <SortButton field="confidence" label="Confidence" />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                    <SortButton field="risk" label="Risk Level" />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                    Best For
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedModels.map((model) => {
                  const isBest = model.id === bestModelId;
                  return (
                    <tr
                      key={model.id}
                      className={`border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${
                        isBest ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isBest && <Trophy className="w-4 h-4 text-yellow-400" />}
                          <span className="font-semibold text-white">{model.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm font-medium ${getModelTypeColor(model.type)}`} dir={isRTL ? 'rtl' : 'ltr'}>
                          {getModelTypeLabel(model.type)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${model.accuracy}%` }}
                            />
                          </div>
                          <span className="text-white font-semibold">{model.accuracy}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">
                          {model.confidenceRange.min}-{model.confidenceRange.max}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            model.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'
                          }
                        >
                          {model.riskLevel}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300 text-sm">
                          {model.useCases[0]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400 text-sm">{model.notes}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="lg:hidden space-y-4">
        {sortedModels.map((model) => {
          const isBest = model.id === bestModelId;
          return (
            <Card
              key={model.id}
              className={
                isBest ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-teal-500/30' : ''
              }
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {isBest && <Trophy className="w-5 h-5 text-yellow-400" />}
                    <h3 className="text-xl font-bold text-white">{model.name}</h3>
                  </div>
                  <span className={`text-sm font-medium ${getModelTypeColor(model.type)}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {getModelTypeLabel(model.type)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Accuracy</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${model.accuracy}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold text-sm">{model.accuracy}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">Confidence Range</div>
                    <div className="text-white font-semibold text-sm">
                      {model.confidenceRange.min}-{model.confidenceRange.max}%
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                    <Badge
                      variant={
                        model.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'
                      }
                    >
                      {model.riskLevel}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">Best For</div>
                    <div className="text-gray-300 text-sm">{model.useCases[0]}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1">Notes</div>
                  <p className="text-gray-400 text-sm">{model.notes}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};
