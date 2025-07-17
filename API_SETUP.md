# Stock API Setup Guide

Your trading project is now configured to fetch real stock prices! Here's how to get it working with live data:

## Current Status
- ✅ **Simulated Real-time Data**: The app now generates realistic stock price movements that update every 30 seconds
- ✅ **Multiple API Support**: Configured to use Finnhub and Alpha Vantage APIs
- ✅ **Automatic Fallbacks**: If APIs are unavailable, the app uses intelligent simulated data
- ✅ **Data Source Indicators**: Shows whether you're seeing live, simulated, or mock data

## To Get Real Live Data (Optional)

### Option 1: Finnhub API (Recommended - Free & No CORS issues)
1. Go to [https://finnhub.io/](https://finnhub.io/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. In `components.js`, replace `'demo'` with your actual API key:
   ```javascript
   const FINNHUB_API_KEY = 'your_real_api_key_here';
   ```

**Free Tier**: 60 calls/minute, perfect for this project

### Option 2: Alpha Vantage API
1. Go to [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Replace the Alpha Vantage API key in `components.js`:
   ```javascript
   const ALPHA_VANTAGE_API_KEY = 'your_real_api_key_here';
   ```

**Free Tier**: 500 requests/day, 5 requests/minute

## How It Works Now

1. **First Attempt**: Tries to fetch real data from Finnhub API
2. **Second Attempt**: If Finnhub fails, tries Alpha Vantage API
3. **Fallback**: If both APIs fail, generates realistic simulated data with:
   - Market-like price movements
   - Time-based fluctuations
   - Realistic volatility patterns
   - Updates every 30 seconds

## Features Added

- **Data Source Indicator**: Shows "Live Data", "Simulated", or "Mock" status
- **Automatic Refresh**: Updates every 2 minutes for live data, 30 seconds for simulated
- **Error Handling**: Graceful fallbacks ensure the app always works
- **Rate Limiting**: Built-in delays to respect API limits
- **Console Logging**: Check browser console to see what's happening

## Testing

1. **Without API Keys**: The app will use simulated data that changes every 30 seconds
2. **With API Keys**: The app will fetch real stock prices
3. **Error Simulation**: Disable your internet to see fallback behavior

## Next Steps

1. Run the app: `npm start` in the frontend directory
2. Watch the data source indicator in the top banner
3. Check browser console for detailed logs
4. Click "Refresh" to manually update data
5. Optionally add real API keys for live data

The app now provides a much more realistic trading experience even without real API keys!
