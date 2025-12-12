import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components';
import { saudiStocks, searchStocks, StockData } from '../data/stocks';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { useRTL } from '../hooks/useRTL';

export const Search = () => {
  const { t } = useTranslation(['search', 'common']);
  const { isRTL } = useRTL();
  const [query, setQuery] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>(saudiStocks);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<StockData[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const results = searchStocks(query);
      setFilteredStocks(results);
      setAutocompleteResults(results.slice(0, 5));
      setShowAutocomplete(true);
    } else {
      setFilteredStocks(saudiStocks);
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const handleAutocompleteSelect = (stock: StockData) => {
    setQuery('');
    setShowAutocomplete(false);
    navigate(`/stock/${stock.symbol}`);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <LandingNav />
      <div className="pt-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('search:title')}
          </h1>
          <p className="text-gray-400">
            {t('search:subtitle')}
          </p>
        </div>

        <div className="relative mb-8">
          <div className="relative">
            <SearchIcon className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query && setShowAutocomplete(true)}
              placeholder={t('search:placeholder')}
              className={`w-full py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all text-lg ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            />
          </div>

          {showAutocomplete && autocompleteResults.length > 0 && (
            <div
              ref={autocompleteRef}
              className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            >
              {autocompleteResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleAutocompleteSelect(stock)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-teal-400 text-lg">
                        {stock.symbol}
                      </span>
                      <span className="text-white font-semibold">
                        {stock.name}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {stock.sector}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {stock.price.toFixed(2)} SAR
                    </div>
                    <div
                      className={`text-sm flex items-center justify-end gap-1 ${
                        stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stock.changePercent >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Card>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {query ? t('search:resultsTitle', { count: filteredStocks.length }) : t('search:topStocksTitle')}
            </h2>
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setShowAutocomplete(false);
                }}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {t('search:clearSearch')}
              </button>
            )}
          </div>

          {filteredStocks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.symbol')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.name')}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.sector')}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.price')}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.change')}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.volume')}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.marketCap')}
                    </th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold text-sm">
                      {t('search:table.action')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => (
                    <tr
                      key={stock.symbol}
                      className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                        index === filteredStocks.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="font-bold text-teal-400 text-lg">
                          {stock.symbol}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">
                          {stock.name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400">{stock.sector}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white font-semibold">
                          {stock.price.toFixed(2)} SAR
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div
                          className={`flex items-center justify-end gap-2 ${
                            stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-semibold">
                            {stock.change >= 0 ? '+' : ''}
                            {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-gray-400">{stock.volume}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-gray-400">{stock.marketCap}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleStockClick(stock.symbol)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg font-semibold transition-all hover:scale-105"
                        >
                          {t('common:view')}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {t('search:noResults', { query })}
              </p>
              <button
                onClick={() => setQuery('')}
                className="mt-4 text-teal-400 hover:text-teal-300 font-semibold"
              >
                {t('search:clearAndViewAll')}
              </button>
            </div>
          )}
        </Card>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};
