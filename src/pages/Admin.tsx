import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Database, Upload, Edit2, TrendingUp, Search, LogOut, User, Brain,
  Menu, X, Clock, Target, Activity, Users as UsersIcon, ChevronUp, ChevronDown, Radar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../components';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import type { Model } from '../types';
import { getAllModels, toggleModelStatus, updateModel, createModel, getModelTypeLabel, getModelTypeColor } from '../lib/modelService';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  current_price: number;
}

interface Prediction {
  id: string;
  stock_id: string;
  prediction_date: string;
  price_1d: number | null;
  change_1d_percent: number | null;
  direction_1d: string | null;
  price_7d: number | null;
  change_7d_percent: number | null;
  direction_7d: string | null;
  price_30d: number | null;
  change_30d_percent: number | null;
  direction_30d: string | null;
  confidence_score: number;
  risk_level: string;
  sentiment_score: number;
  stocks?: Stock;
  updated_at?: string;
}

interface ScannerData {
  id: string;
  stock_id: string;
  signal_type: string;
  signal_strength: number;
  timestamp: string;
  stocks?: Stock;
}

interface AppUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

type View = 'overview' | 'stocks' | 'predictions' | 'scanner' | 'users' | 'models' | 'upload' | 'edit';
type SortField = 'symbol' | 'name' | 'sector' | 'price' | 'date' | 'confidence' | 'risk' | 'email' | 'role' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const Admin = () => {
  const { user, signOut } = useAuth();
  const [activeView, setActiveView] = useState<View>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [scannerData, setScannerData] = useState<ScannerData[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadStocks(),
      loadPredictions(),
      loadModels(),
      loadScannerData(),
      loadUsers()
    ]);
    setLoading(false);
  };

  const loadStocks = async () => {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('symbol');

    if (error) {
      console.error('Error loading stocks:', error);
    } else {
      setStocks(data || []);
    }
  };

  const loadPredictions = async () => {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        stocks (
          id,
          symbol,
          name,
          sector,
          current_price
        )
      `)
      .order('prediction_date', { ascending: false });

    if (error) {
      console.error('Error loading predictions:', error);
    } else {
      setPredictions(data || []);
    }
  };

  const loadModels = async () => {
    try {
      const data = await getAllModels();
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const loadScannerData = async () => {
    const { data, error } = await supabase
      .from('market_scanner_data')
      .select(`
        *,
        stocks (
          id,
          symbol,
          name,
          sector,
          current_price
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error loading scanner data:', error);
    } else {
      setScannerData(data || []);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditPrediction = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setActiveView('edit');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedData = <T extends any>(data: T[], field: string): T[] => {
    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'symbol' || field === 'name') {
        aVal = a.stocks?.[field] || a[field];
        bVal = b.stocks?.[field] || b[field];
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredStocks = getSortedData(
    stocks.filter(stock =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    sortField
  );

  const filteredPredictions = getSortedData(
    predictions.filter(pred =>
      pred.stocks?.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pred.stocks?.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    sortField
  );

  const filteredScannerData = scannerData.filter(data =>
    data.stocks?.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.signal_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = getSortedData(
    users.filter(u =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    sortField
  );

  const avgConfidence = predictions.length > 0
    ? Math.round(predictions.reduce((sum, p) => sum + p.confidence_score, 0) / predictions.length)
    : 0;

  const lastUpdate = predictions.length > 0
    ? new Date(predictions[0].updated_at || predictions[0].prediction_date).toLocaleString()
    : 'No data';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6 text-gray-400" /> : <Menu className="w-6 h-6 text-gray-400" />}
              </button>
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl text-teal-400 font-bold">◆</span>
                <span className="text-xl font-bold text-white">DAWALLY Admin</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link to="/dashboard">
                <Button variant="secondary" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{user?.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {sidebarOpen && (
          <aside className="w-64 min-h-screen bg-gray-900/50 border-r border-gray-800 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => { setActiveView('overview'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'overview'
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/50'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>

              <button
                onClick={() => { setActiveView('stocks'); setSearchQuery(''); setSortField('symbol'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'stocks'
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/50'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                <Database className="w-5 h-5" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">Stocks</span>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">{stocks.length}</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveView('predictions'); setSearchQuery(''); setSortField('date'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'predictions'
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/50'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">Predictions</span>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">{predictions.length}</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveView('scanner'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'scanner'
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/50'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                <Radar className="w-5 h-5" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">Scanner Data</span>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">{scannerData.length}</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveView('users'); setSearchQuery(''); setSortField('created_at'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'users'
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/50'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                <UsersIcon className="w-5 h-5" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">Users</span>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">{users.length}</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveView('models'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'models'
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/50'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                <Brain className="w-5 h-5" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">AI Models</span>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">{models.length}</span>
                </div>
              </button>

              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => { setActiveView('upload'); setSearchQuery(''); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeView === 'upload'
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/50'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload</span>
                </button>
              </div>
            </nav>
          </aside>
        )}

        <main className={`flex-1 p-8 transition-all ${sidebarOpen ? 'ml-0' : ''}`}>
          {activeView === 'overview' && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Real-time analytics and system metrics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <Database className="w-8 h-8 text-teal-400" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{stocks.length}</div>
                      <div className="text-sm text-gray-400">Total Stocks</div>
                    </div>
                  </div>
                  <div className="text-xs text-teal-400">Active in market</div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{predictions.length}</div>
                      <div className="text-sm text-gray-400">Total Predictions</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-400">AI-generated insights</div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-emerald-400" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{avgConfidence}%</div>
                      <div className="text-sm text-gray-400">Avg Confidence</div>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-400">Model accuracy metric</div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-amber-400" />
                    <div className="text-right">
                      <div className="text-lg font-bold text-white truncate">{lastUpdate}</div>
                      <div className="text-sm text-gray-400">Last Update</div>
                    </div>
                  </div>
                  <div className="text-xs text-amber-400">Latest prediction time</div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-400">Total Users</span>
                      <span className="text-white font-semibold">{users.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-400">Active Models</span>
                      <span className="text-white font-semibold">{models.filter(m => m.is_active).length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-gray-400">Scanner Signals</span>
                      <span className="text-white font-semibold">{scannerData.length}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {predictions.slice(0, 5).map((pred) => (
                      <div key={pred.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div>
                          <div className="text-teal-400 font-semibold">{pred.stocks?.symbol}</div>
                          <div className="text-xs text-gray-500">{new Date(pred.prediction_date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{pred.confidence_score}%</div>
                          <div className="text-xs text-gray-400">confidence</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}

          {(activeView === 'stocks' || activeView === 'predictions' || activeView === 'scanner' || activeView === 'users') && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {activeView === 'stocks' && 'Stocks Management'}
                    {activeView === 'predictions' && 'Predictions Management'}
                    {activeView === 'scanner' && 'Scanner Data'}
                    {activeView === 'users' && 'Users Management'}
                  </h1>
                  <p className="text-gray-400">
                    {activeView === 'stocks' && `${filteredStocks.length} stocks in system`}
                    {activeView === 'predictions' && `${filteredPredictions.length} predictions generated`}
                    {activeView === 'scanner' && `${filteredScannerData.length} market signals detected`}
                    {activeView === 'users' && `${filteredUsers.length} registered users`}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeView}...`}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                  />
                </div>
              </div>

              <Card>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
                    <p className="text-gray-400 mt-4">Loading...</p>
                  </div>
                ) : activeView === 'stocks' ? (
                  <StocksTable stocks={filteredStocks} onSort={handleSort} sortField={sortField} sortDirection={sortDirection} />
                ) : activeView === 'predictions' ? (
                  <PredictionsTable predictions={filteredPredictions} onEdit={handleEditPrediction} onSort={handleSort} sortField={sortField} sortDirection={sortDirection} />
                ) : activeView === 'scanner' ? (
                  <ScannerTable data={filteredScannerData} />
                ) : activeView === 'users' ? (
                  <UsersTable users={filteredUsers} onSort={handleSort} sortField={sortField} sortDirection={sortDirection} />
                ) : null}
              </Card>
            </>
          )}

          {activeView === 'models' && (
            <Card className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
                  <p className="text-gray-400 mt-4">Loading...</p>
                </div>
              ) : (
                <ModelsManagement models={models} onUpdate={loadModels} />
              )}
            </Card>
          )}

          {activeView === 'upload' && (
            <Card className="p-6">
              <UploadForm stocks={stocks} onSuccess={() => { loadPredictions(); setActiveView('predictions'); }} />
            </Card>
          )}

          {activeView === 'edit' && selectedPrediction && (
            <Card className="p-6">
              <EditForm
                prediction={selectedPrediction}
                stocks={stocks}
                onSuccess={() => { loadPredictions(); setActiveView('predictions'); setSelectedPrediction(null); }}
                onCancel={() => { setActiveView('predictions'); setSelectedPrediction(null); }}
              />
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => {
  if (!active) return <ChevronUp className="w-4 h-4 text-gray-600" />;
  return direction === 'asc' ?
    <ChevronUp className="w-4 h-4 text-teal-400" /> :
    <ChevronDown className="w-4 h-4 text-teal-400" />;
};

const StocksTable = ({
  stocks,
  onSort,
  sortField,
  sortDirection
}: {
  stocks: Stock[];
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th
            onClick={() => onSort('symbol')}
            className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              Symbol
              <SortIcon active={sortField === 'symbol'} direction={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('name')}
            className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              Name
              <SortIcon active={sortField === 'name'} direction={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('sector')}
            className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              Sector
              <SortIcon active={sortField === 'sector'} direction={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('price')}
            className="text-right py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center justify-end gap-2">
              Price
              <SortIcon active={sortField === 'price'} direction={sortDirection} />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
            <td className="py-3 px-4 text-teal-400 font-bold">{stock.symbol}</td>
            <td className="py-3 px-4 text-white">{stock.name}</td>
            <td className="py-3 px-4 text-gray-400">{stock.sector}</td>
            <td className="py-3 px-4 text-right text-white font-semibold">{stock.current_price.toFixed(2)} SAR</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PredictionsTable = ({
  predictions,
  onEdit,
  onSort,
  sortField,
  sortDirection
}: {
  predictions: Prediction[];
  onEdit: (p: Prediction) => void;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Stock</th>
          <th
            onClick={() => onSort('date')}
            className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              Date
              <SortIcon active={sortField === 'date'} direction={sortDirection} />
            </div>
          </th>
          <th className="text-right py-3 px-4 text-gray-400 font-semibold">1D</th>
          <th className="text-right py-3 px-4 text-gray-400 font-semibold">7D</th>
          <th className="text-right py-3 px-4 text-gray-400 font-semibold">30D</th>
          <th
            onClick={() => onSort('confidence')}
            className="text-center py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              Confidence
              <SortIcon active={sortField === 'confidence'} direction={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('risk')}
            className="text-center py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              Risk
              <SortIcon active={sortField === 'risk'} direction={sortDirection} />
            </div>
          </th>
          <th className="text-center py-3 px-4 text-gray-400 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((pred) => (
          <tr key={pred.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
            <td className="py-3 px-4">
              <div className="text-teal-400 font-bold">{pred.stocks?.symbol}</div>
              <div className="text-xs text-gray-500">{pred.stocks?.name}</div>
            </td>
            <td className="py-3 px-4 text-gray-400 text-sm">{new Date(pred.prediction_date).toLocaleDateString()}</td>
            <td className="py-3 px-4 text-right">
              <div className={`text-sm font-semibold ${pred.change_1d_percent && pred.change_1d_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {pred.change_1d_percent ? `${pred.change_1d_percent > 0 ? '+' : ''}${pred.change_1d_percent.toFixed(2)}%` : '-'}
              </div>
            </td>
            <td className="py-3 px-4 text-right">
              <div className={`text-sm font-semibold ${pred.change_7d_percent && pred.change_7d_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {pred.change_7d_percent ? `${pred.change_7d_percent > 0 ? '+' : ''}${pred.change_7d_percent.toFixed(2)}%` : '-'}
              </div>
            </td>
            <td className="py-3 px-4 text-right">
              <div className={`text-sm font-semibold ${pred.change_30d_percent && pred.change_30d_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {pred.change_30d_percent ? `${pred.change_30d_percent > 0 ? '+' : ''}${pred.change_30d_percent.toFixed(2)}%` : '-'}
              </div>
            </td>
            <td className="py-3 px-4 text-center">
              <span className="inline-block px-2 py-1 rounded bg-teal-500/20 text-teal-400 text-sm font-semibold">
                {pred.confidence_score}%
              </span>
            </td>
            <td className="py-3 px-4 text-center">
              <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
                pred.risk_level === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                pred.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {pred.risk_level}
              </span>
            </td>
            <td className="py-3 px-4 text-center">
              <button
                onClick={() => onEdit(pred)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ScannerTable = ({ data }: { data: ScannerData[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Stock</th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Signal Type</th>
          <th className="text-center py-3 px-4 text-gray-400 font-semibold">Strength</th>
          <th className="text-right py-3 px-4 text-gray-400 font-semibold">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
            <td className="py-3 px-4">
              <div className="text-teal-400 font-bold">{item.stocks?.symbol}</div>
              <div className="text-xs text-gray-500">{item.stocks?.name}</div>
            </td>
            <td className="py-3 px-4">
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                item.signal_type === 'volume' ? 'bg-blue-500/20 text-blue-400' :
                item.signal_type === 'sentiment' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {item.signal_type}
              </span>
            </td>
            <td className="py-3 px-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                    style={{ width: `${item.signal_strength}%` }}
                  />
                </div>
                <span className="text-white font-semibold text-sm">{item.signal_strength}%</span>
              </div>
            </td>
            <td className="py-3 px-4 text-right text-gray-400 text-sm">
              {new Date(item.timestamp).toLocaleString()}
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={4} className="py-12 text-center text-gray-500">
              No scanner data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const UsersTable = ({
  users,
  onSort,
  sortField,
  sortDirection
}: {
  users: AppUser[];
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th
            onClick={() => onSort('email')}
            className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              Email
              <SortIcon active={sortField === 'email'} direction={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('role')}
            className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              Role
              <SortIcon active={sortField === 'role'} direction={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('created_at')}
            className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              Registered
              <SortIcon active={sortField === 'created_at'} direction={sortDirection} />
            </div>
          </th>
          <th className="text-left py-3 px-4 text-gray-400 font-semibold">Last Sign In</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
            <td className="py-3 px-4 text-white">{user.email}</td>
            <td className="py-3 px-4">
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                user.role === 'admin' ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-700 text-gray-300'
              }`}>
                {user.role || 'user'}
              </span>
            </td>
            <td className="py-3 px-4 text-gray-400 text-sm">
              {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td className="py-3 px-4 text-gray-400 text-sm">
              {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan={4} className="py-12 text-center text-gray-500">
              No users found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const UploadForm = ({ stocks, onSuccess }: { stocks: Stock[]; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    stock_id: '',
    price_1d: '',
    change_1d_percent: '',
    price_7d: '',
    change_7d_percent: '',
    price_30d: '',
    change_30d_percent: '',
    confidence_score: '',
    risk_level: 'Medium',
    sentiment_score: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('predictions').insert([{
        stock_id: formData.stock_id,
        prediction_date: new Date().toISOString().split('T')[0],
        price_1d: formData.price_1d ? parseFloat(formData.price_1d) : null,
        change_1d_percent: formData.change_1d_percent ? parseFloat(formData.change_1d_percent) : null,
        direction_1d: formData.change_1d_percent ? (parseFloat(formData.change_1d_percent) > 0 ? 'Up' : 'Down') : null,
        price_7d: formData.price_7d ? parseFloat(formData.price_7d) : null,
        change_7d_percent: formData.change_7d_percent ? parseFloat(formData.change_7d_percent) : null,
        direction_7d: formData.change_7d_percent ? (parseFloat(formData.change_7d_percent) > 0 ? 'Up' : 'Down') : null,
        price_30d: formData.price_30d ? parseFloat(formData.price_30d) : null,
        change_30d_percent: formData.change_30d_percent ? parseFloat(formData.change_30d_percent) : null,
        direction_30d: formData.change_30d_percent ? (parseFloat(formData.change_30d_percent) > 0 ? 'Up' : 'Down') : null,
        confidence_score: parseFloat(formData.confidence_score),
        risk_level: formData.risk_level,
        sentiment_score: parseFloat(formData.sentiment_score)
      }]);

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to upload prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Upload New Prediction</h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Stock</label>
        <select
          value={formData.stock_id}
          onChange={(e) => setFormData({ ...formData, stock_id: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          required
        >
          <option value="">Select stock...</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">1D Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_1d}
            onChange={(e) => setFormData({ ...formData, price_1d: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="28.50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">1D Change %</label>
          <input
            type="number"
            step="0.01"
            value={formData.change_1d_percent}
            onChange={(e) => setFormData({ ...formData, change_1d_percent: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="1.24"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">7D Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_7d}
            onChange={(e) => setFormData({ ...formData, price_7d: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="29.20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">7D Change %</label>
          <input
            type="number"
            step="0.01"
            value={formData.change_7d_percent}
            onChange={(e) => setFormData({ ...formData, change_7d_percent: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="2.46"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">30D Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_30d}
            onChange={(e) => setFormData({ ...formData, price_30d: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="31.00"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">30D Change %</label>
          <input
            type="number"
            step="0.01"
            value={formData.change_30d_percent}
            onChange={(e) => setFormData({ ...formData, change_30d_percent: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="8.77"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Confidence Score (0-100)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.confidence_score}
            onChange={(e) => setFormData({ ...formData, confidence_score: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="85"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Risk Level</label>
          <select
            value={formData.risk_level}
            onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Sentiment (-1 to 1)</label>
          <input
            type="number"
            step="0.01"
            min="-1"
            max="1"
            value={formData.sentiment_score}
            onChange={(e) => setFormData({ ...formData, sentiment_score: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            placeholder="0.5"
            required
          />
        </div>
      </div>

      <Button type="submit" isLoading={loading} className="w-full">
        Upload Prediction
      </Button>
    </form>
  );
};

const EditForm = ({ prediction, stocks, onSuccess, onCancel }: { prediction: Prediction; stocks: Stock[]; onSuccess: () => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    stock_id: prediction.stock_id,
    price_1d: prediction.price_1d?.toString() || '',
    change_1d_percent: prediction.change_1d_percent?.toString() || '',
    price_7d: prediction.price_7d?.toString() || '',
    change_7d_percent: prediction.change_7d_percent?.toString() || '',
    price_30d: prediction.price_30d?.toString() || '',
    change_30d_percent: prediction.change_30d_percent?.toString() || '',
    confidence_score: prediction.confidence_score.toString(),
    risk_level: prediction.risk_level,
    sentiment_score: prediction.sentiment_score.toString()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('predictions')
        .update({
          stock_id: formData.stock_id,
          price_1d: formData.price_1d ? parseFloat(formData.price_1d) : null,
          change_1d_percent: formData.change_1d_percent ? parseFloat(formData.change_1d_percent) : null,
          direction_1d: formData.change_1d_percent ? (parseFloat(formData.change_1d_percent) > 0 ? 'Up' : 'Down') : null,
          price_7d: formData.price_7d ? parseFloat(formData.price_7d) : null,
          change_7d_percent: formData.change_7d_percent ? parseFloat(formData.change_7d_percent) : null,
          direction_7d: formData.change_7d_percent ? (parseFloat(formData.change_7d_percent) > 0 ? 'Up' : 'Down') : null,
          price_30d: formData.price_30d ? parseFloat(formData.price_30d) : null,
          change_30d_percent: formData.change_30d_percent ? parseFloat(formData.change_30d_percent) : null,
          direction_30d: formData.change_30d_percent ? (parseFloat(formData.change_30d_percent) > 0 ? 'Up' : 'Down') : null,
          confidence_score: parseFloat(formData.confidence_score),
          risk_level: formData.risk_level,
          sentiment_score: parseFloat(formData.sentiment_score),
          updated_at: new Date().toISOString()
        })
        .eq('id', prediction.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Edit Prediction</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Stock</label>
        <select
          value={formData.stock_id}
          onChange={(e) => setFormData({ ...formData, stock_id: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          required
        >
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.symbol} - {stock.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">1D Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_1d}
            onChange={(e) => setFormData({ ...formData, price_1d: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">1D Change %</label>
          <input
            type="number"
            step="0.01"
            value={formData.change_1d_percent}
            onChange={(e) => setFormData({ ...formData, change_1d_percent: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">7D Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_7d}
            onChange={(e) => setFormData({ ...formData, price_7d: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">7D Change %</label>
          <input
            type="number"
            step="0.01"
            value={formData.change_7d_percent}
            onChange={(e) => setFormData({ ...formData, change_7d_percent: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">30D Price</label>
          <input
            type="number"
            step="0.01"
            value={formData.price_30d}
            onChange={(e) => setFormData({ ...formData, price_30d: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">30D Change %</label>
          <input
            type="number"
            step="0.01"
            value={formData.change_30d_percent}
            onChange={(e) => setFormData({ ...formData, change_30d_percent: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Confidence Score (0-100)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.confidence_score}
            onChange={(e) => setFormData({ ...formData, confidence_score: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Risk Level</label>
          <select
            value={formData.risk_level}
            onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Sentiment (-1 to 1)</label>
          <input
            type="number"
            step="0.01"
            min="-1"
            max="1"
            value={formData.sentiment_score}
            onChange={(e) => setFormData({ ...formData, sentiment_score: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" isLoading={loading} className="flex-1">
          Update Prediction
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const ModelsManagement = ({ models, onUpdate }: { models: Model[]; onUpdate: () => void }) => {
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleStatus = async (model: Model) => {
    setLoading(true);
    setError('');
    try {
      await toggleModelStatus(model.id, !model.is_active);
      await onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle model status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModel = async (modelId: string, updates: any) => {
    setLoading(true);
    setError('');
    try {
      await updateModel(modelId, updates);
      await onUpdate();
      setEditingModel(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update model');
    } finally {
      setLoading(false);
    }
  };

  if (editingModel) {
    return (
      <ModelEditForm
        model={editingModel}
        onSave={handleUpdateModel}
        onCancel={() => setEditingModel(null)}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">AI Models Management</h3>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-6 rounded-xl border-2 transition-all ${
              model.is_active
                ? 'bg-gray-800/50 border-cyan-500/50'
                : 'bg-gray-800/30 border-gray-700 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">{model.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getModelTypeColor(model.type)} bg-gray-900/50`}>
                    {getModelTypeLabel(model.type)}
                  </span>
                  {model.accuracy && (
                    <span className="px-2 py-1 rounded text-xs font-semibold text-teal-400 bg-teal-500/20">
                      {model.accuracy}% Accuracy
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{model.description}</p>
                {model.strengths.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Strengths:</p>
                    <div className="flex flex-wrap gap-2">
                      {model.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-900/50 border border-gray-700 rounded text-xs text-gray-300"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {model.use_cases.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Best For:</p>
                    <div className="flex flex-wrap gap-2">
                      {model.use_cases.map((useCase, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-300"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingModel(model)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                  disabled={loading}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleStatus(model)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    model.is_active
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                  }`}
                  disabled={loading}
                >
                  {model.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModelEditForm = ({
  model,
  onSave,
  onCancel,
  loading,
  error
}: {
  model: Model;
  onSave: (id: string, updates: any) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}) => {
  const [formData, setFormData] = useState({
    name: model.name,
    description: model.description || '',
    accuracy: model.accuracy?.toString() || '',
    strengths: model.strengths.join(', '),
    use_cases: model.use_cases.join(', ')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(model.id, {
      name: formData.name,
      description: formData.description,
      accuracy: formData.accuracy ? parseFloat(formData.accuracy) : null,
      strengths: formData.strengths.split(',').map(s => s.trim()).filter(Boolean),
      use_cases: formData.use_cases.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Edit Model: {model.name}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Model Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Accuracy (%)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={formData.accuracy}
          onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Strengths (comma-separated)</label>
        <input
          type="text"
          value={formData.strengths}
          onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          placeholder="Pattern recognition, Short-term accuracy"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Use Cases (comma-separated)</label>
        <input
          type="text"
          value={formData.use_cases}
          onChange={(e) => setFormData({ ...formData, use_cases: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
          placeholder="Day trading, Swing trading"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" isLoading={loading} className="flex-1">
          Save Changes
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
