export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
}

export const saudiStocks: StockData[] = [
  {
    symbol: '2222',
    name: 'Saudi Aramco',
    sector: 'Energy',
    price: 28.50,
    change: 0.35,
    changePercent: 1.24,
    volume: '45.2M',
    marketCap: '2.1T SAR'
  },
  {
    symbol: '1120',
    name: 'Al Rajhi Bank',
    sector: 'Banking',
    price: 85.20,
    change: -0.80,
    changePercent: -0.93,
    volume: '12.5M',
    marketCap: '255B SAR'
  },
  {
    symbol: '2010',
    name: 'SABIC',
    sector: 'Chemicals',
    price: 94.60,
    change: 1.20,
    changePercent: 1.28,
    volume: '8.3M',
    marketCap: '252B SAR'
  },
  {
    symbol: '1180',
    name: 'Riyad Bank',
    sector: 'Banking',
    price: 32.40,
    change: 0.15,
    changePercent: 0.46,
    volume: '5.7M',
    marketCap: '64.8B SAR'
  },
  {
    symbol: '1010',
    name: 'Saudi National Bank',
    sector: 'Banking',
    price: 32.80,
    change: -0.25,
    changePercent: -0.76,
    volume: '18.9M',
    marketCap: '98.4B SAR'
  },
  {
    symbol: '7010',
    name: 'STC',
    sector: 'Telecommunications',
    price: 52.30,
    change: 0.60,
    changePercent: 1.16,
    volume: '3.2M',
    marketCap: '104.6B SAR'
  },
  {
    symbol: '2030',
    name: 'Saudi Kayan',
    sector: 'Chemicals',
    price: 14.82,
    change: -0.18,
    changePercent: -1.20,
    volume: '11.4M',
    marketCap: '29.6B SAR'
  },
  {
    symbol: '2290',
    name: 'Yanbu Cement',
    sector: 'Construction',
    price: 53.70,
    change: 0.90,
    changePercent: 1.70,
    volume: '1.8M',
    marketCap: '6.4B SAR'
  },
  {
    symbol: '2380',
    name: 'Almarai',
    sector: 'Food & Beverages',
    price: 58.20,
    change: 0.40,
    changePercent: 0.69,
    volume: '2.1M',
    marketCap: '58.2B SAR'
  },
  {
    symbol: '4031',
    name: 'Jarir Marketing',
    sector: 'Retail',
    price: 168.40,
    change: -2.10,
    changePercent: -1.23,
    volume: '620K',
    marketCap: '33.7B SAR'
  },
  {
    symbol: '4230',
    name: 'Red Sea International',
    sector: 'Transportation',
    price: 67.50,
    change: 1.50,
    changePercent: 2.27,
    volume: '890K',
    marketCap: '4.1B SAR'
  },
  {
    symbol: '1140',
    name: 'Bank Albilad',
    sector: 'Banking',
    price: 42.35,
    change: 0.55,
    changePercent: 1.32,
    volume: '4.8M',
    marketCap: '42.4B SAR'
  },
  {
    symbol: '2020',
    name: 'SABIC Agri-Nutrients',
    sector: 'Chemicals',
    price: 132.60,
    change: -1.40,
    changePercent: -1.04,
    volume: '1.5M',
    marketCap: '132.6B SAR'
  },
  {
    symbol: '4081',
    name: 'Dr. Sulaiman Al Habib',
    sector: 'Healthcare',
    price: 214.80,
    change: 3.20,
    changePercent: 1.51,
    volume: '1.2M',
    marketCap: '107.4B SAR'
  },
  {
    symbol: '4280',
    name: 'Kingdom Holding',
    sector: 'Investment',
    price: 11.26,
    change: -0.14,
    changePercent: -1.23,
    volume: '7.6M',
    marketCap: '42.2B SAR'
  },
  {
    symbol: '2060',
    name: 'Advanced Petrochemical',
    sector: 'Chemicals',
    price: 56.40,
    change: 0.70,
    changePercent: 1.26,
    volume: '2.3M',
    marketCap: '33.8B SAR'
  },
  {
    symbol: '1182',
    name: 'Alinma Bank',
    sector: 'Banking',
    price: 28.95,
    change: 0.25,
    changePercent: 0.87,
    volume: '6.4M',
    marketCap: '28.9B SAR'
  },
  {
    symbol: '2040',
    name: 'Petro Rabigh',
    sector: 'Energy',
    price: 21.34,
    change: -0.46,
    changePercent: -2.11,
    volume: '9.8M',
    marketCap: '21.3B SAR'
  },
  {
    symbol: '4006',
    name: 'Etihad Etisalat',
    sector: 'Telecommunications',
    price: 38.70,
    change: 0.50,
    changePercent: 1.31,
    volume: '3.9M',
    marketCap: '38.7B SAR'
  },
  {
    symbol: '4002',
    name: 'Mouwasat Medical',
    sector: 'Healthcare',
    price: 156.20,
    change: 2.40,
    changePercent: 1.56,
    volume: '450K',
    marketCap: '31.2B SAR'
  }
];

export const searchStocks = (query: string): StockData[] => {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return saudiStocks;
  }

  return saudiStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(lowerQuery) ||
    stock.name.toLowerCase().includes(lowerQuery) ||
    stock.sector.toLowerCase().includes(lowerQuery)
  );
};

export const getStockBySymbol = (symbol: string): StockData | undefined => {
  return saudiStocks.find(stock => stock.symbol === symbol);
};
