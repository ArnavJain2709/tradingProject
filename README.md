# Trading 212 Clone 📈

A comprehensive replica of the Trading 212 platform built with React, featuring **real-time stock prices**, intelligent API fallbacks, portfolio management, and professional trading interface.

## 🚀 Features

### 📊 Real-Time Stock Data (NEW!)
- **Live Stock Prices**: Real-time data from Finnhub and Alpha Vantage APIs
- **Intelligent Fallbacks**: Automatic switching between APIs when one fails  
- **Smart Simulation**: Realistic price movements when APIs are unavailable
- **Data Source Indicators**: Visual badges showing "Live Data", "Simulated", or "Mock"
- **Auto-Updates**: Refreshes every 2 minutes (live) or 30 seconds (simulated)

### Core Trading Platform
- **Portfolio Management**: Track holdings with real-time P&L calculations
- **Stock Trading Interface**: Buy/sell orders with market/limit/stop options
- **Interactive Charts**: Technical analysis with Chart.js
- **Watchlist**: Personal stock tracking with live updates
- **Market News**: Latest financial news and market updates

### Professional UI/UX
- **Trading 212 Design**: Exact replica of the original platform
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for professional interactions
- **Real-time Updates**: Live price changes and portfolio tracking

### Technical Features
- **React 19**: Modern hooks and state management
- **TailwindCSS**: Utility-first CSS framework
- **Chart.js**: Interactive charts and data visualization
- **Framer Motion**: Smooth animations and transitions
- **Multiple APIs**: Finnhub, Alpha Vantage with intelligent fallbacks
- **Lucide React**: Consistent iconography

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager
- Modern web browser

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trading-212-clone
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Stock Data API Setup

### 🚀 New Multi-API System (v2.0)

The app now features an **intelligent multi-API system** with automatic fallbacks:

#### 🎯 How It Works
1. **Primary**: Tries Finnhub API (no CORS issues)
2. **Fallback**: Falls back to Alpha Vantage API  
3. **Smart Simulation**: Uses realistic price simulation if both APIs fail
4. **Status Indicators**: Shows data source with colored badges

#### 📈 Current Status
Without any setup, the app provides **realistic simulated data** that:
- Updates every 30 seconds with market-like movements
- Includes proper volatility patterns for each stock
- Simulates realistic volume and price changes
- Shows "Simulated" badge in the interface

### 🔑 Getting Real Live Data (Optional)

#### Option 1: Finnhub API (Recommended)
**Free Tier**: 60 calls/minute - Perfect for this project!

1. **Get API Key**
   ```bash
   # Visit https://finnhub.io/
   # Sign up for free account
   # Copy your API key from dashboard
   ```

2. **Update Configuration**
   ```javascript
   // In frontend/src/components.js, line 20
   const FINNHUB_API_KEY = 'your_actual_api_key_here'; // Replace 'demo'
   ```

3. **Restart the app** - You'll see "Live Data" badge!

#### Option 2: Alpha Vantage API  
**Free Tier**: 500 requests/day, 5 requests/minute

1. **Get API Key**
   ```bash
   # Visit https://www.alphavantage.co/support/#api-key
   # Sign up for free
   # Get your API key
   ```

2. **Update Configuration**
   ```javascript
   // In frontend/src/components.js, line 23
   const ALPHA_VANTAGE_API_KEY = 'your_api_key_here'; // Replace 'demo'
   ```

Currently tracking: **AAPL, GOOGL, MSFT, TSLA, NVDA, AMZN, META, NFLX**

### 📊 Data Features

#### Stock Information Available
- **Real-time Prices**: Current stock price from live APIs
- **Price Changes**: Dollar and percentage changes from previous close
- **Trading Volume**: Daily trading volume (real or simulated)
- **Market Metrics**: Market cap, P/E ratios, day high/low, open price
- **Sector Data**: Industry sector classification

#### Update Frequency & Performance
- **Live Data**: Updates every 2 minutes (respects API rate limits)
- **Simulated Data**: Updates every 30 seconds with realistic movements  
- **Manual Refresh**: Available on all pages with loading indicators
- **Intelligent Rate Limiting**: Progressive delays (500ms-2s) to prevent API abuse
- **Mixed Data Support**: Handles partial live/simulated data scenarios
- **429 Error Handling**: Automatic detection and response to rate limit errors

#### Smart Fallback System
- **Primary API Failure**: Automatically tries secondary API
- **Rate Limit Detection**: Switches to simulation when APIs hit limits
- **All APIs Down**: Switches to realistic simulation mode
- **Network Issues**: Graceful error handling with user feedback
- **Status Transparency**: Always shows current data source (Live/Mixed/Simulated/Mock)

### 🎛️ Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```bash
# Optional: Alpha Vantage API Key
REACT_APP_ALPHA_VANTAGE_KEY=your_api_key_here

# Optional: Custom API endpoints
REACT_APP_STOCK_API_URL=https://your-custom-api.com

# Optional: Update frequency (minutes)
REACT_APP_UPDATE_FREQUENCY=5
```

### Customization Options

#### Adding New Stocks
```javascript
// In components.js, update STOCK_SYMBOLS array
const STOCK_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 
  'AMZN', 'META', 'NFLX', 'UBER', 'ZOOM'
];
```

#### Changing Update Frequency
```javascript
// In useStockData hook
const interval = setInterval(fetchStocks, 10 * 60 * 1000); // 10 minutes
```

#### Portfolio Customization
```javascript
// In generatePortfolio function, modify holdings
const baseHoldings = [
  { symbol: 'AAPL', shares: 100, avgPrice: 150.00 },
  { symbol: 'GOOGL', shares: 50, avgPrice: 120.00 },
  // Add more holdings
];
```

## 🎨 UI Customization

### Theme Colors
The app uses Trading 212's blue color scheme. To customize:

```javascript
// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Trading 212 blue
        secondary: '#10B981',  // Success green
        danger: '#EF4444',     // Error red
      }
    }
  }
}
```

### Dark Mode
Dark mode is automatically saved to localStorage and persists across sessions.

## 📱 Components Overview

### Core Components
- **Dashboard**: Portfolio overview and market summary
- **Trading**: Stock search, filtering, and trading interface
- **Portfolio**: Holdings management and performance tracking
- **Watchlist**: Personal stock tracking
- **News**: Market news and updates
- **Settings**: User preferences and configuration

### Data Management
- **useStockData**: Main hook for stock data management
- **generatePortfolio**: Calculates portfolio metrics
- **fetchRealStockData**: API integration for live data

## 🔍 Troubleshooting

### 🆘 Common Issues

#### No Live Data / Always Shows "Simulated"
```bash
# Check your API keys in components.js:
# Line 20: FINNHUB_API_KEY = 'your_key_here'  
# Line 23: ALPHA_VANTAGE_API_KEY = 'your_key_here'

# Check browser console for API errors
# Verify API keys are active and have remaining quota
```

#### App Not Loading / White Screen
```bash
# Check if development server is running
cd frontend && npm start

# Clear browser cache and localStorage
# Check browser console for JavaScript errors
```

#### Prices Not Updating
- Verify you have internet connectivity
- Check if you've hit API rate limits (wait a few minutes)
- Use manual refresh button to force update
- Check browser console for API error messages

#### Performance Issues
- API rate limits may cause delays
- Consider upgrading to premium API tiers  
- Check network connectivity and speed

### 🐛 Debug Information

#### Enable Debug Logging
Check the browser console (F12) to see:
```javascript
// These messages help diagnose issues:
"Fetching real-time stock data..."
"Successfully fetched real stock data: 8 stocks"  
"Using simulated stock data"
"Finnhub API failed for AAPL, trying fallback..."
```

#### Data Source Verification
- Look for colored badges: "Live Data" (green), "Simulated" (yellow), "Mock" (gray)
- Check "Updated" timestamp in the status banner
- Manual refresh should trigger new API calls (check console)

## 🚀 Deployment

### Build for Production
```bash
cd frontend
yarn build
```

### Environment Setup
1. Set production API keys
2. Configure CORS for your domain
3. Set up proper error monitoring
4. Configure analytics (optional)

### Hosting Options
- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting with CI/CD
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repos

## 📊 Performance Optimization

### API Optimization
- **Caching**: Implement Redis for API responses
- **Rate Limiting**: Respect API limits
- **Batch Requests**: Fetch multiple stocks at once
- **WebSockets**: For real-time updates

### Frontend Optimization
- **Code Splitting**: Lazy load components
- **Image Optimization**: Compress images
- **Bundle Analysis**: Optimize bundle size
- **Caching**: Browser caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes only. Not affiliated with Trading 212.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Verify all dependencies are installed

## 🔮 Future Enhancements

### 🚀 Planned Features (Next Version)
- **WebSocket Integration**: Real-time streaming data for sub-second updates
- **Historical Charts**: Interactive charts with historical price data
- **Advanced Charts**: Technical indicators, candlestick charts, drawing tools
- **Options Trading**: Options contracts interface and Greeks calculations
- **Crypto Support**: Cryptocurrency trading with major coins
- **Mobile App**: React Native version for iOS/Android
- **User Accounts**: Personal watchlists, portfolios, and settings persistence
- **News Integration**: Real-time news feed with stock-specific alerts
- **Economic Calendar**: Economic events and earnings announcements

### 🔧 Technical Improvements
- **TypeScript Migration**: Full TypeScript support for better development experience
- **Testing Suite**: Comprehensive unit and integration tests
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Performance Monitoring**: Real-time performance metrics and error tracking
- **Database Integration**: User data persistence with PostgreSQL/MongoDB
- **Authentication System**: Secure user login with JWT tokens

### 📊 Data Enhancements
- **More APIs**: Additional data sources for better redundancy
- **International Markets**: Support for global stock exchanges
- **Forex & Commodities**: Foreign exchange and commodity trading
- **Real-time Analytics**: Advanced portfolio analytics and risk metrics
- **Backtesting**: Historical portfolio performance simulation

### ✅ Recently Implemented (v2.0)
- ✅ **Multiple API Integration**: Finnhub and Alpha Vantage with intelligent fallbacks
- ✅ **Real-time Data**: Live stock prices with automatic updates  
- ✅ **Smart Simulation**: Realistic price movements when APIs unavailable
- ✅ **Status Indicators**: Visual feedback for data sources
- ✅ **Error Recovery**: Graceful handling of API failures
- ✅ **Rate Limiting**: Built-in protection against API abuse
- ✅ **Performance Optimization**: Efficient data fetching and state management

---

**Note**: This is a demo application using mock/free tier APIs. For production use, implement proper API keys, error handling, and user authentication.
