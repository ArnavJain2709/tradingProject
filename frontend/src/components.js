import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Menu, 
  X, 
  Eye, 
  EyeOff, 
  Bell, 
  Settings as SettingsIcon, 
  User, 
  Star, 
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  DollarSign,
  Activity,
  Home,
  Briefcase,
  BookOpen,
  CandlestickChart,
  Globe,
  Target,
  Shield,
  Zap,
  Users,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Upload,
  History,
  Calculator,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  CheckCircle,
  Info,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Financial API Configuration
// You can get free API keys from:
// 1. Alpha Vantage: https://www.alphavantage.co/support/#api-key (500 requests/day)
// 2. Financial Modeling Prep: https://financialmodelingprep.com/developer/docs (250 requests/day)
// 3. Polygon.io: https://polygon.io/ (5 requests/minute free)

const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || 'demo'; // Get free key from https://finnhub.io/
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo'; // Get free key from https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Stock symbols we want to track
const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX'];

// Function to fetch real stock data using multiple APIs with fallbacks
const fetchRealStockData = async (symbol) => {
  console.log(`🔍 Fetching data for ${symbol}...`);
  
  // Try Finnhub API first (no CORS issues)
  try {
    console.log(`📡 Trying Finnhub API for ${symbol}...`);
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const data = response.data;
    
    console.log(`📊 Finnhub response for ${symbol}:`, data);
    
    if (data && data.c && data.c > 0) {
      const currentPrice = data.c; // Current price
      const previousClose = data.pc; // Previous close
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      console.log(`✅ Finnhub success for ${symbol}: $${currentPrice}`);
      
      return {
        symbol: symbol,
        name: getCompanyName(symbol),
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: Math.floor(Math.random() * 50000000) + 10000000, // Simulated volume
        marketCap: getMarketCap(symbol),
        high: data.h || currentPrice * 1.02, // High price
        low: data.l || currentPrice * 0.98, // Low price
        open: data.o || previousClose, // Open price
        close: currentPrice,
        pe: getPERatio(symbol),
        sector: getSectorForSymbol(symbol),
        dataSource: 'live' // Mark as live data
      };
    } else {
      console.log(`❌ Finnhub returned invalid data for ${symbol}:`, data);
    }
  } catch (error) {
    console.log(`❌ Finnhub API failed for ${symbol}:`, error.message);
  }

  // Fallback: Try Alpha Vantage API
  try {
    console.log(`📡 Trying Alpha Vantage API for ${symbol}...`);
    const response = await axios.get(`${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = response.data;
    
    console.log(`📊 Alpha Vantage response for ${symbol}:`, data);
    
    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const quote = data['Global Quote'];
      const currentPrice = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
      
      console.log(`✅ Alpha Vantage success for ${symbol}: $${currentPrice}`);
      
      return {
        symbol: symbol,
        name: getCompanyName(symbol),
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: parseInt(quote['06. volume']) || Math.floor(Math.random() * 50000000) + 10000000,
        marketCap: getMarketCap(symbol),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        close: currentPrice,
        pe: getPERatio(symbol),
        sector: getSectorForSymbol(symbol),
        dataSource: 'live' // Mark as live data
      };
    } else {
      console.log(`❌ Alpha Vantage returned invalid data for ${symbol}:`, data);
    }
  } catch (error) {
    console.log(`❌ Alpha Vantage API failed for ${symbol}:`, error.message);
  }

  // Final fallback: Generate realistic simulated data based on real market patterns
  console.log(`🎭 Using simulated data for ${symbol}`);
  const simulatedData = generateRealisticStockData(symbol);
  simulatedData.dataSource = 'simulated';
  return simulatedData;
};

// Helper function to get company names
const getCompanyName = (symbol) => {
  const companies = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corp.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corp.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'NFLX': 'Netflix Inc.'
  };
  return companies[symbol] || symbol;
};

// Helper function to get approximate market caps
const getMarketCap = (symbol) => {
  const marketCaps = {
    'AAPL': '3.01T',
    'GOOGL': '1.78T',
    'MSFT': '2.81T',
    'TSLA': '791B',
    'NVDA': '2.15T',
    'AMZN': '1.51T',
    'META': '1.27T',
    'NFLX': '287B'
  };
  return marketCaps[symbol] || 'N/A';
};

// Helper function to get approximate P/E ratios
const getPERatio = (symbol) => {
  const peRatios = {
    'AAPL': 31.2,
    'GOOGL': 26.8,
    'MSFT': 35.7,
    'TSLA': 65.4,
    'NVDA': 72.1,
    'AMZN': 45.2,
    'META': 24.8,
    'NFLX': 35.6
  };
  return peRatios[symbol] || 25.0;
};

// Function to generate realistic stock data with market-like fluctuations
const generateRealisticStockData = (symbol) => {
  // Updated with more realistic prices as of July 2025
  const baseData = {
    'AAPL': { price: 194.27, volatility: 0.02 },
    'GOOGL': { price: 138.21, volatility: 0.025 },
    'MSFT': { price: 371.82, volatility: 0.018 },
    'TSLA': { price: 234.86, volatility: 0.04 },
    'NVDA': { price: 171.45, volatility: 0.035 }, // Fixed: was 873.45, now realistic
    'AMZN': { price: 143.65, volatility: 0.022 },
    'META': { price: 486.91, volatility: 0.03 },
    'NFLX': { price: 612.78, volatility: 0.028 }
  };

  const base = baseData[symbol] || { price: 100, volatility: 0.02 };
  
  // Add some realistic market fluctuation
  const randomChange = (Math.random() - 0.5) * 2 * base.volatility;
  const timeBasedChange = Math.sin(Date.now() / 3600000) * base.volatility * 0.5; // Hourly pattern
  const totalChange = randomChange + timeBasedChange;
  
  const currentPrice = base.price * (1 + totalChange);
  const previousClose = base.price;
  const change = currentPrice - previousClose;
  const changePercent = (change / previousClose) * 100;
  
  return {
    symbol: symbol,
    name: getCompanyName(symbol),
    price: currentPrice,
    change: change,
    changePercent: changePercent,
    volume: Math.floor(Math.random() * 50000000) + 10000000,
    marketCap: getMarketCap(symbol),
    high: currentPrice * 1.02,
    low: currentPrice * 0.98,
    open: previousClose * (1 + (Math.random() - 0.5) * 0.01),
    close: currentPrice,
    pe: getPERatio(symbol),
    sector: getSectorForSymbol(symbol)
  };
};

// Function to get sector for a symbol (since API doesn't always provide this)
const getSectorForSymbol = (symbol) => {
  const sectors = {
    'AAPL': 'Technology',
    'GOOGL': 'Technology',
    'MSFT': 'Technology',
    'TSLA': 'Consumer Discretionary',
    'NVDA': 'Technology',
    'AMZN': 'Consumer Discretionary',
    'META': 'Communication Services',
    'NFLX': 'Communication Services'
  };
  return sectors[symbol] || 'Technology';
};

// Function to fetch all stock data with improved error handling
const fetchAllStockData = async () => {
  console.log('Fetching real-time stock data...');
  
  try {
    // Fetch data for all symbols with some delay to avoid rate limiting
    const results = [];
    
    for (let i = 0; i < STOCK_SYMBOLS.length; i++) {
      const symbol = STOCK_SYMBOLS[i];
      try {
        const stockData = await fetchRealStockData(symbol);
        if (stockData) {
          results.push(stockData);
        }
        
        // Add small delay between requests to avoid rate limiting
        if (i < STOCK_SYMBOLS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${symbol}:`, error);
        // Add fallback data for this symbol
        results.push(generateRealisticStockData(symbol));
      }
    }
    
    return results.length > 0 ? results : null;
  } catch (error) {
    console.error('Error in fetchAllStockData:', error);
    return null;
  }
};

// Mock data for stocks (fallback if API fails)
const fallbackMockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 193.42,
    change: 2.87,
    changePercent: 1.51,
    volume: 45123456,
    marketCap: '3.01T',
    high: 195.23,
    low: 191.12,
    open: 192.45,
    close: 193.42,
    pe: 31.2,
    sector: 'Technology'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    change: -1.23,
    changePercent: -0.85,
    volume: 32456789,
    marketCap: '1.78T',
    high: 144.23,
    low: 141.34,
    open: 143.12,
    close: 142.56,
    pe: 26.8,
    sector: 'Technology'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    volume: 28345678,
    marketCap: '2.81T',
    high: 380.45,
    low: 376.23,
    open: 377.34,
    close: 378.85,
    pe: 35.7,
    sector: 'Technology'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.73,
    change: -8.45,
    changePercent: -3.29,
    volume: 87654321,
    marketCap: '791B',
    high: 255.67,
    low: 246.89,
    open: 253.45,
    close: 248.73,
    pe: 65.4,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 873.45,
    change: 23.67,
    changePercent: 2.79,
    volume: 45123987,
    marketCap: '2.15T',
    high: 878.90,
    low: 865.23,
    open: 868.12,
    close: 873.45,
    pe: 72.1,
    sector: 'Technology'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 145.23,
    change: 1.89,
    changePercent: 1.32,
    volume: 31245678,
    marketCap: '1.51T',
    high: 146.78,
    low: 143.45,
    open: 144.12,
    close: 145.23,
    pe: 45.2,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 501.23,
    change: -7.34,
    changePercent: -1.44,
    volume: 19876543,
    marketCap: '1.27T',
    high: 508.90,
    low: 499.45,
    open: 506.78,
    close: 501.23,
    pe: 24.8,
    sector: 'Communication Services'
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 645.78,
    change: 12.34,
    changePercent: 1.95,
    volume: 8765432,
    marketCap: '287B',
    high: 648.90,
    low: 635.45,
    open: 638.12,
    close: 645.78,
    pe: 35.6,
    sector: 'Communication Services'
  }
];

// Global state for stock data
let globalStockData = fallbackMockStocks;

// Hook to fetch and manage real stock data
// Hook to fetch and manage real stock data
const useStockData = () => {
  const [stocks, setStocks] = useState(fallbackMockStocks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataSource, setDataSource] = useState('mock');

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to fetch real stock data...');
      const realData = await fetchAllStockData();
      
      if (realData && realData.length > 0) {
        setStocks(realData);
        globalStockData = realData;
        setLastUpdated(new Date());
        setDataSource('live');
        setError(null);
        console.log('Successfully fetched real stock data:', realData.length, 'stocks');
      } else {
        // Generate realistic simulated data instead of using static mock data
        const simulatedData = STOCK_SYMBOLS.map(symbol => generateRealisticStockData(symbol));
        setStocks(simulatedData);
        globalStockData = simulatedData;
        setLastUpdated(new Date());
        setDataSource('simulated');
        setError('Using simulated data - API rate limited or unavailable');
        console.log('Using simulated stock data');
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      // Generate realistic simulated data as fallback
      const simulatedData = STOCK_SYMBOLS.map(symbol => generateRealisticStockData(symbol));
      setStocks(simulatedData);
      globalStockData = simulatedData;
      setLastUpdated(new Date());
      setDataSource('simulated');
      setError('Using simulated data - Network error or API unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    
    // Refresh data every 2 minutes for live data, every 30 seconds for simulated data
    const refreshInterval = dataSource === 'live' ? 2 * 60 * 1000 : 30 * 1000;
    const interval = setInterval(fetchStocks, refreshInterval);
    
    return () => clearInterval(interval);
  }, [dataSource]);

  return { 
    stocks, 
    loading, 
    error, 
    lastUpdated, 
    dataSource,
    refreshStocks: fetchStocks 
  };
};
const mockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 193.42,
    change: 2.87,
    changePercent: 1.51,
    volume: 45123456,
    marketCap: '3.01T',
    high: 195.23,
    low: 191.12,
    open: 192.45,
    close: 193.42,
    pe: 31.2,
    sector: 'Technology'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    change: -1.23,
    changePercent: -0.85,
    volume: 32456789,
    marketCap: '1.78T',
    high: 144.23,
    low: 141.34,
    open: 143.12,
    close: 142.56,
    pe: 26.8,
    sector: 'Technology'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    volume: 28345678,
    marketCap: '2.81T',
    high: 380.45,
    low: 376.23,
    open: 377.34,
    close: 378.85,
    pe: 35.7,
    sector: 'Technology'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.73,
    change: -8.45,
    changePercent: -3.29,
    volume: 87654321,
    marketCap: '791B',
    high: 255.67,
    low: 246.89,
    open: 253.45,
    close: 248.73,
    pe: 65.4,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 873.45,
    change: 23.67,
    changePercent: 2.79,
    volume: 45123987,
    marketCap: '2.15T',
    high: 878.90,
    low: 865.23,
    open: 868.12,
    close: 873.45,
    pe: 72.1,
    sector: 'Technology'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 145.23,
    change: 1.89,
    changePercent: 1.32,
    volume: 31245678,
    marketCap: '1.51T',
    high: 146.78,
    low: 143.45,
    open: 144.12,
    close: 145.23,
    pe: 45.2,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 501.23,
    change: -7.34,
    changePercent: -1.44,
    volume: 19876543,
    marketCap: '1.27T',
    high: 508.90,
    low: 499.45,
    open: 506.78,
    close: 501.23,
    pe: 24.8,
    sector: 'Communication Services'
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 645.78,
    change: 12.34,
    changePercent: 1.95,
    volume: 8765432,
    marketCap: '287B',
    high: 648.90,
    low: 635.45,
    open: 638.12,
    close: 645.78,
    pe: 35.6,
    sector: 'Communication Services'
  }
];

// Mock portfolio data
const mockPortfolio = {
  totalValue: 45789.23,
  totalGain: 2345.67,
  totalGainPercent: 5.40,
  dayChange: 123.45,
  dayChangePercent: 0.27,
  holdings: [
    { symbol: 'AAPL', shares: 50, avgPrice: 180.50, currentPrice: 193.42, value: 9671.00 },
    { symbol: 'GOOGL', shares: 25, avgPrice: 135.20, currentPrice: 142.56, value: 3564.00 },
    { symbol: 'MSFT', shares: 30, avgPrice: 360.75, currentPrice: 378.85, value: 11365.50 },
    { symbol: 'TSLA', shares: 20, avgPrice: 220.30, currentPrice: 248.73, value: 4974.60 },
    { symbol: 'NVDA', shares: 15, avgPrice: 750.80, currentPrice: 873.45, value: 13101.75 }
  ]
};

// Generate portfolio based on current stock prices
const generatePortfolio = (stocks) => {
  const baseHoldings = [
    { symbol: 'AAPL', shares: 50, avgPrice: 180.50 },
    { symbol: 'GOOGL', shares: 25, avgPrice: 135.20 },
    { symbol: 'MSFT', shares: 30, avgPrice: 360.75 },
    { symbol: 'TSLA', shares: 20, avgPrice: 220.30 },
    { symbol: 'NVDA', shares: 15, avgPrice: 750.80 }
  ];

  const holdings = baseHoldings.map(holding => {
    const stock = stocks.find(s => s.symbol === holding.symbol);
    const currentPrice = stock ? stock.price : holding.avgPrice;
    const value = holding.shares * currentPrice;
    
    return {
      ...holding,
      currentPrice,
      value
    };
  });

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.shares * holding.avgPrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;

  return {
    totalValue,
    totalGain,
    totalGainPercent,
    dayChange: totalValue * 0.0027, // Simulate 0.27% daily change
    dayChangePercent: 0.27,
    holdings
  };
};

// Mock news data
const mockNews = [
  {
    id: 1,
    title: 'Apple Reports Strong Q4 Earnings Amid iPhone 15 Launch',
    summary: 'Apple exceeded expectations with revenue of $119.58 billion driven by strong iPhone sales.',
    source: 'MarketWatch',
    time: '2 hours ago',
    category: 'Earnings',
    symbol: 'AAPL'
  },
  {
    id: 2,
    title: 'Tesla Announces New Gigafactory in Mexico',
    summary: 'Tesla plans to build a new manufacturing facility in Monterrey, Mexico to increase production capacity.',
    source: 'Reuters',
    time: '4 hours ago',
    category: 'Company News',
    symbol: 'TSLA'
  },
  {
    id: 3,
    title: 'Federal Reserve Hints at Interest Rate Cuts',
    summary: 'Fed officials signal potential rate cuts in upcoming meetings amid cooling inflation data.',
    source: 'Bloomberg',
    time: '6 hours ago',
    category: 'Economic News',
    symbol: 'SPY'
  },
  {
    id: 4,
    title: 'NVIDIA Partnerships Drive AI Chip Demand',
    summary: 'Strategic partnerships with major tech companies boost NVIDIA\'s AI chip revenue projections.',
    source: 'TechCrunch',
    time: '8 hours ago',
    category: 'Technology',
    symbol: 'NVDA'
  }
];

// Chart data generators
const generateChartData = (symbol) => {
  const data = [];
  const labels = [];
  let basePrice = mockStocks.find(s => s.symbol === symbol)?.price || 100;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString());
    
    basePrice += (Math.random() - 0.5) * 10;
    data.push(basePrice);
  }
  
  return { labels, data };
};

const portfolioChartData = {
  labels: ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy'],
  datasets: [{
    data: [45, 20, 15, 12, 8],
    backgroundColor: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6'
    ],
    borderWidth: 0
  }]
};

// Header Component
export const Header = ({ darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen }) => {
  const { stocks } = useStockData();
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  const currentPortfolio = generatePortfolio(stocks);
  
  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b backdrop-blur-md bg-opacity-95`}>
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-blue-600">Trading 212</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm font-medium">Portfolio Value:</span>
            <span className={`text-lg font-bold ${currentPortfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balanceVisible ? `$${currentPortfolio.totalValue.toLocaleString()}` : '••••••'}
            </span>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className={`p-1 rounded ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {balanceVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Bell size={20} />
          </button>
          
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
export const Sidebar = ({ darkMode, isOpen, setActiveTab, activeTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
    { id: 'news', label: 'News', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed left-0 top-16 h-full w-64 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r z-40`}
        >
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-600 text-white' 
                        : darkMode 
                          ? 'hover:bg-gray-800 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Stock Card Component
export const StockCard = ({ stock, darkMode, onClick }) => {
  const isPositive = stock.change >= 0;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(stock)}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg">{stock.symbol}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {stock.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">${stock.price.toFixed(2)}</p>
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Vol: {(stock.volume / 1000000).toFixed(1)}M
        </span>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {stock.sector}
        </span>
      </div>
    </motion.div>
  );
};

// Stock Detail Modal Component
export const StockDetailModal = ({ stock, isOpen, onClose, darkMode }) => {
  const [activeChart, setActiveChart] = useState('1D');
  const [orderType, setOrderType] = useState('market');
  const [orderSide, setOrderSide] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock?.price || 0);
  
  if (!stock) return null;
  
  const chartData = generateChartData(stock.symbol);
  
  const lineChartData = {
    labels: chartData.labels,
    datasets: [{
      label: stock.symbol,
      data: chartData.data,
      borderColor: stock.change >= 0 ? '#10B981' : '#EF4444',
      backgroundColor: stock.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6
    }]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
        titleColor: darkMode ? '#FFFFFF' : '#000000',
        bodyColor: darkMode ? '#D1D5DB' : '#374151',
        borderColor: darkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-lg ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{stock.symbol}</h2>
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stock.name}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl font-bold">${stock.price.toFixed(2)}</span>
                      <div className={`flex items-center space-x-1 ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.change >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        <span className="text-lg font-medium">
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-4">
                      {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setActiveChart(period)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            activeChart === period
                              ? 'bg-blue-600 text-white'
                              : darkMode
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                    
                    <div className="h-64">
                      <Line data={lineChartData} options={chartOptions} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Open</p>
                      <p className="text-lg font-bold">${stock.open.toFixed(2)}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>High</p>
                      <p className="text-lg font-bold">${stock.high.toFixed(2)}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Low</p>
                      <p className="text-lg font-bold">${stock.low.toFixed(2)}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Volume</p>
                      <p className="text-lg font-bold">{(stock.volume / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <h3 className="text-lg font-bold mb-4">Quick Trade</h3>
                  
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setOrderSide('buy')}
                      className={`flex-1 py-2 rounded-lg font-medium ${
                        orderSide === 'buy'
                          ? 'bg-green-600 text-white'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setOrderSide('sell')}
                      className={`flex-1 py-2 rounded-lg font-medium ${
                        orderSide === 'sell'
                          ? 'bg-red-600 text-white'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Order Type</label>
                      <select
                        value={orderType}
                        onChange={(e) => setOrderType(e.target.value)}
                        className={`w-full p-2 rounded-lg border ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="market">Market Order</option>
                        <option value="limit">Limit Order</option>
                        <option value="stop">Stop Order</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className={`w-full p-2 rounded-lg border ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="1"
                      />
                    </div>
                    
                    {orderType === 'limit' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value))}
                          className={`w-full p-2 rounded-lg border ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          step="0.01"
                        />
                      </div>
                    )}
                    
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Estimated Total:</span>
                        <span className="text-lg font-bold">
                          ${(quantity * (orderType === 'limit' ? price : stock.price)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      className={`w-full py-3 rounded-lg font-bold text-white ${
                        orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {orderSide === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Dashboard Component
export const Dashboard = ({ darkMode }) => {
  const { stocks, loading, error, lastUpdated, dataSource, refreshStocks } = useStockData();
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  
  const currentPortfolio = generatePortfolio(stocks);
  
  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setShowStockDetail(true);
  };
  
  const portfolioPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Portfolio Value',
      data: [42000, 43500, 41200, 44800, 46200, currentPortfolio.totalValue],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
  
  return (
    <div className="space-y-6">
      {/* Data Status */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {loading && <RefreshCw className="animate-spin" size={16} />}
            <div className="flex items-center space-x-3">
              <span className="text-sm">
                {loading ? 'Updating stock prices...' : 'Stock data active'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                dataSource === 'live' 
                  ? 'bg-green-100 text-green-800' 
                  : dataSource === 'simulated' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {dataSource === 'live' ? 'Live Data' : dataSource === 'simulated' ? 'Simulated' : 'Mock'}
              </span>
              {lastUpdated && (
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            {error && (
              <span className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {error}
              </span>
            )}
          </div>
          <button
            onClick={refreshStocks}
            disabled={loading}
            className={`px-3 py-1 rounded text-sm ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Refresh
          </button>
        </div>
      </div>
      
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Value</p>
              <p className="text-2xl font-bold">${currentPortfolio.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Gain</p>
              <p className={`text-2xl font-bold ${currentPortfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentPortfolio.totalGain >= 0 ? '+' : ''}${currentPortfolio.totalGain.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Change</p>
              <p className={`text-2xl font-bold ${currentPortfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentPortfolio.dayChange >= 0 ? '+' : ''}${currentPortfolio.dayChange.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Holdings</p>
              <p className="text-2xl font-bold">{currentPortfolio.holdings.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="text-purple-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h3 className="text-lg font-bold mb-4">Portfolio Performance</h3>
          <div className="h-64">
            <Line data={portfolioPerformanceData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  grid: {
                    color: darkMode ? '#374151' : '#E5E7EB'
                  },
                  ticks: {
                    color: darkMode ? '#9CA3AF' : '#6B7280'
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: darkMode ? '#9CA3AF' : '#6B7280'
                  }
                }
              }
            }} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h3 className="text-lg font-bold mb-4">Asset Allocation</h3>
          <div className="h-64">
            <Doughnut data={portfolioChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: darkMode ? '#D1D5DB' : '#374151'
                  }
                }
              }
            }} />
          </div>
        </motion.div>
      </div>
      
      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Market Overview</h3>
          <button 
            onClick={refreshStocks}
            disabled={loading}
            className={`p-2 rounded-lg ${
              loading 
                ? 'text-gray-400 cursor-not-allowed' 
                : darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
            }`}
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stocks.slice(0, 4).map((stock, index) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              darkMode={darkMode}
              onClick={handleStockClick}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Recent News */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <h3 className="text-lg font-bold mb-4">Market News</h3>
        <div className="space-y-4">
          {mockNews.slice(0, 3).map((news) => (
            <div key={news.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{news.title}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {news.summary}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {news.source}
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {news.time}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {news.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      <StockDetailModal
        stock={selectedStock}
        isOpen={showStockDetail}
        onClose={() => setShowStockDetail(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

// Trading Component
export const Trading = ({ darkMode }) => {
  const { stocks, loading, error, dataSource, refreshStocks } = useStockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  const [filterSector, setFilterSector] = useState('all');
  
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = filterSector === 'all' || stock.sector === filterSector;
    return matchesSearch && matchesSector;
  });
  
  const sectors = ['all', ...new Set(stocks.map(stock => stock.sector))];
  
  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setShowStockDetail(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Data Status */}
      {(loading || error) && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {loading && <RefreshCw className="animate-spin" size={16} />}
              <span className="text-sm">
                {loading ? 'Updating stock prices...' : error ? error : 'Data updated'}
              </span>
            </div>
            <button
              onClick={refreshStocks}
              disabled={loading}
              className={`px-3 py-1 rounded text-sm ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {sectors.map(sector => (
            <option key={sector} value={sector}>
              {sector === 'all' ? 'All Sectors' : sector}
            </option>
          ))}
        </select>
      </div>
      
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>S&P 500</p>
              <p className="text-xl font-bold">4,725.36</p>
              <p className="text-sm text-green-600">+0.84%</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>NASDAQ</p>
              <p className="text-xl font-bold">14,845.12</p>
              <p className="text-sm text-red-600">-0.23%</p>
            </div>
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>DOW</p>
              <p className="text-xl font-bold">37,234.89</p>
              <p className="text-sm text-green-600">+0.46%</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>
      
      {/* Stock List */}
      <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold">Available Stocks</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                darkMode={darkMode}
                onClick={handleStockClick}
              />
            ))}
          </div>
        </div>
      </div>
      
      <StockDetailModal
        stock={selectedStock}
        isOpen={showStockDetail}
        onClose={() => setShowStockDetail(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

// Portfolio Component
export const Portfolio = ({ darkMode }) => {
  const { stocks, loading, error, dataSource, refreshStocks } = useStockData();
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  
  const currentPortfolio = generatePortfolio(stocks);
  
  const handleHoldingClick = (holding) => {
    const stock = stocks.find(s => s.symbol === holding.symbol);
    setSelectedHolding(stock);
    setShowStockDetail(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Data Status */}
      {(loading || error) && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {loading && <RefreshCw className="animate-spin" size={16} />}
              <span className="text-sm">
                {loading ? 'Updating portfolio...' : error ? error : 'Portfolio updated'}
              </span>
            </div>
            <button
              onClick={refreshStocks}
              disabled={loading}
              className={`px-3 py-1 rounded text-sm ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h3 className="text-lg font-bold mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-blue-600">${currentPortfolio.totalValue.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="text-green-600 mr-1" size={16} />
            <span className={`font-medium ${currentPortfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentPortfolio.totalGain >= 0 ? '+' : ''}${currentPortfolio.totalGain.toLocaleString()} ({currentPortfolio.totalGainPercent.toFixed(2)}%)
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h3 className="text-lg font-bold mb-2">Today's Change</h3>
          <p className={`text-3xl font-bold ${currentPortfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentPortfolio.dayChange >= 0 ? '+' : ''}${currentPortfolio.dayChange.toFixed(2)}
          </p>
          <div className="flex items-center mt-2">
            <span className={`font-medium ${currentPortfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentPortfolio.dayChange >= 0 ? '+' : ''}{currentPortfolio.dayChangePercent.toFixed(2)}%
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h3 className="text-lg font-bold mb-2">Holdings</h3>
          <p className="text-3xl font-bold">{currentPortfolio.holdings.length}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Active positions
          </p>
        </motion.div>
      </div>
      
      {/* Holdings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold">Your Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <th className="text-left p-4 font-semibold">Symbol</th>
                <th className="text-left p-4 font-semibold">Shares</th>
                <th className="text-left p-4 font-semibold">Avg Price</th>
                <th className="text-left p-4 font-semibold">Current Price</th>
                <th className="text-left p-4 font-semibold">Market Value</th>
                <th className="text-left p-4 font-semibold">Gain/Loss</th>
                <th className="text-left p-4 font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {currentPortfolio.holdings.map((holding, index) => {
                const gainLoss = holding.value - (holding.shares * holding.avgPrice);
                const gainLossPercent = (gainLoss / (holding.shares * holding.avgPrice)) * 100;
                const isPositive = gainLoss >= 0;
                
                return (
                  <tr
                    key={holding.symbol}
                    className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => handleHoldingClick(holding)}
                  >
                    <td className="p-4">
                      <div className="font-bold">{holding.symbol}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stocks.find(s => s.symbol === holding.symbol)?.name}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{holding.shares}</td>
                    <td className="p-4">${holding.avgPrice.toFixed(2)}</td>
                    <td className="p-4">${holding.currentPrice.toFixed(2)}</td>
                    <td className="p-4 font-bold">${holding.value.toLocaleString()}</td>
                    <td className={`p-4 font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}${gainLoss.toFixed(2)}
                    </td>
                    <td className={`p-4 font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Portfolio Allocation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <h3 className="text-lg font-bold mb-4">Portfolio Allocation</h3>
        <div className="h-64">
          <Doughnut data={portfolioChartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: darkMode ? '#D1D5DB' : '#374151'
                }
              }
            }
          }} />
        </div>
      </motion.div>
      
      <StockDetailModal
        stock={selectedHolding}
        isOpen={showStockDetail}
        onClose={() => setShowStockDetail(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

// Watchlist Component
export const Watchlist = ({ darkMode }) => {
  const { stocks, loading, error, dataSource, refreshStocks } = useStockData();
  const [watchlist, setWatchlist] = useState(stocks.slice(0, 6));
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  
  // Update watchlist when stocks change
  useEffect(() => {
    if (stocks.length > 0) {
      setWatchlist(stocks.slice(0, 6));
    }
  }, [stocks]);
  
  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setShowStockDetail(true);
  };
  
  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Watchlist</h2>
        <div className="flex space-x-2">
          <button
            onClick={refreshStocks}
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>
      
      {/* Data Status */}
      {(loading || error) && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            {loading && <RefreshCw className="animate-spin" size={16} />}
            <span className="text-sm">
              {loading ? 'Updating watchlist...' : error ? error : 'Watchlist updated'}
            </span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((stock) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleStockClick(stock)}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg">{stock.symbol}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stock.name}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(stock.symbol);
                }}
                className={`p-1 rounded-full hover:bg-red-100 hover:text-red-600 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                <div className={`flex items-center space-x-1 ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="text-sm font-medium">
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className={`${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {stock.sector}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {watchlist.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Eye size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Your watchlist is empty</p>
          <p className="text-sm">Add stocks to keep track of their performance</p>
        </div>
      )}
      
      <StockDetailModal
        stock={selectedStock}
        isOpen={showStockDetail}
        onClose={() => setShowStockDetail(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

// News Component
export const News = ({ darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);
  
  const categories = ['all', 'Earnings', 'Company News', 'Economic News', 'Technology'];
  
  const filteredNews = selectedCategory === 'all' 
    ? mockNews 
    : mockNews.filter(news => news.category === selectedCategory);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market News</h2>
        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <RefreshCw size={20} />
        </button>
      </div>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'All News' : category}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredNews.map((news) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg border cursor-pointer transition-all ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedNews(news)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {news.category}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {news.symbol}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  {news.summary}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {news.source}
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {news.time}
                  </span>
                </div>
              </div>
              <ChevronRight className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Settings Component
export const Settings = ({ darkMode, toggleDarkMode }) => {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsUpdates: true,
    portfolioUpdates: true,
    marketOpen: false
  });
  
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'English',
    timezone: 'UTC-5'
  });
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4">Notifications</h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <button
                  onClick={() => setNotifications(prev => ({...prev, [key]: !value}))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Preferences */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences(prev => ({...prev, currency: e.target.value}))}
                className={`w-full p-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({...prev, language: e.target.value}))}
                className={`w-full p-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences(prev => ({...prev, timezone: e.target.value}))}
                className={`w-full p-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="UTC-5">UTC-5 (New York)</option>
                <option value="UTC-8">UTC-8 (Los Angeles)</option>
                <option value="UTC+0">UTC+0 (London)</option>
                <option value="UTC+1">UTC+1 (Berlin)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Security */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-lg font-bold mb-4">Security</h3>
          <div className="space-y-4">
            <button className="w-full p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-medium">Change Password</span>
                <ChevronRight size={20} />
              </div>
            </button>
            
            <button className="w-full p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-medium">Two-Factor Authentication</span>
                <ChevronRight size={20} />
              </div>
            </button>
            
            <button className="w-full p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-medium">Login Activity</span>
                <ChevronRight size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};