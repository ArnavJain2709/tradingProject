# Trading 212 Clone 📈

A comprehensive replica of the Trading 212 platform built with React, featuring real-time stock prices, portfolio management, and professional trading interface.

## 🚀 Features

### Core Trading Platform
- **Real-time Stock Data**: Live prices from Yahoo Finance API
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
- **Axios**: HTTP client for API requests
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

### Current Implementation
The app uses **Yahoo Finance API** for real-time stock data with automatic fallback to mock data.

### API Configuration

#### Option 1: Yahoo Finance (Default - No Setup Required)
The app is pre-configured to use Yahoo Finance API which requires no API key:

```javascript
// Already configured in components.js
const YAHOO_FINANCE_PROXY = 'https://query1.finance.yahoo.com/v8/finance/chart/';
```

**Supported Stocks**: AAPL, GOOGL, MSFT, TSLA, NVDA, AMZN, META, NFLX

#### Option 2: Alpha Vantage (Premium Alternative)
For more reliable data, you can use Alpha Vantage:

1. **Get API Key**
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Sign up for free account
   - Get your API key

2. **Update Configuration**
   ```javascript
   // In components.js, update the API key
   const ALPHA_VANTAGE_API_KEY = 'YOUR_API_KEY_HERE';
   ```

3. **Modify fetchRealStockData function**
   ```javascript
   // Replace Yahoo Finance implementation with Alpha Vantage
   const fetchRealStockData = async (symbol) => {
     const response = await axios.get(
       `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
     );
     // Process Alpha Vantage response
   };
   ```

#### Option 3: Other APIs

**IEX Cloud**
- Free tier available
- Real-time and historical data
- Requires API key registration

**Finnhub**
- Free tier with 60 calls/minute
- Comprehensive market data
- WebSocket support for real-time updates

**Twelve Data**
- Free tier available
- Multiple data sources
- Good for international markets

### API Features

#### Current Data Points
- **Real-time Prices**: Current stock price
- **Price Changes**: Dollar and percentage changes
- **Volume**: Trading volume
- **Market Cap**: Market capitalization
- **Day High/Low**: Daily price range
- **P/E Ratio**: Price-to-earnings ratio
- **Sector Information**: Stock sector classification

#### Update Frequency
- **Automatic**: Every 5 minutes
- **Manual**: Refresh buttons on all components
- **Real-time**: During market hours

#### Error Handling
- **Fallback System**: Automatic switch to mock data
- **Retry Logic**: Built-in error recovery
- **User Feedback**: Clear status indicators

## 🔧 Configuration

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

### Common Issues

#### API Not Working
```bash
# Check console for errors
# Verify API endpoints are accessible
# Ensure CORS is properly configured
```

#### Slow Loading
- API rate limits may cause delays
- Consider upgrading to premium API
- Check network connectivity

#### Data Not Updating
- Verify API key is correct
- Check if API service is operational
- Ensure proper error handling

### Debug Mode
Enable debug logging:
```javascript
// In components.js
console.log('Stock data:', stocks);
console.log('API response:', response.data);
```

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

### Planned Features
- **WebSocket Integration**: Real-time price streaming
- **Advanced Charts**: Technical indicators and drawing tools
- **Options Trading**: Options contracts interface
- **Crypto Support**: Cryptocurrency trading
- **Mobile App**: React Native version
- **Backend API**: Custom API for user data
- **Authentication**: User accounts and data persistence

### API Upgrades
- **Premium Data**: Professional market data
- **International Markets**: Global stock exchanges
- **Real-time News**: Live news feed integration
- **Economic Calendar**: Economic events and announcements

---

**Note**: This is a demo application using mock/free tier APIs. For production use, implement proper API keys, error handling, and user authentication.
