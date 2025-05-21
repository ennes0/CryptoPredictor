import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Container,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fade,
  ClickAwayListener,
  Skeleton,
  Divider,
  Alert,
  AlertTitle,
  Menu,
  useTheme
} from '@mui/material';
import {
  Search,
  TrendingUp,
  TrendingDown,
  ShowChart,
  Calculate,
  Close,
  CloudOff,
  Analytics,
  Person,
  Settings,
  Logout
} from '@mui/icons-material';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import './components/Navbar.css';

// Import local components
import SimpleAnimatedNumber from './SimpleAnimatedNumber';
import PriceHistoryChart from './components/PriceHistoryChart';
import TweetFeed from './components/TweetFeed';

// Import PredictionInputs component
import PredictionInputs from './components/PredictionInputs';
import CustomCursor from './components/CustomCursor';

// Update API configuration to support both local development and production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api-url.com' // Replace with your actual deployed backend URL
  : 'http://localhost:8000';

// Add API integration functions
const fetchPrediction = async (coinSymbol, lookback = 60, futureDays = 7, mcSamples = 100, trainNewModel = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coin_symbol: coinSymbol,
        lookback,
        future_days: futureDays,
        mc_samples: mcSamples,
        train_new_model: trainNewModel
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch prediction');
    }

    return await response.json();
  } catch (error) {
    console.error('Prediction API error:', error);
    throw error;
  }
};

const fetchCryptoDetails = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/crypto-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coin_symbol: symbol
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch crypto details');
    }

    return await response.json();
  } catch (error) {
    console.error('Crypto Details API error:', error);
    throw error;
  }
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [riskLevel, setRiskLevel] = useState(2);
  const [error, setError] = useState(null);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchInputRef = useRef(null);
  const [highlightedOption, setHighlightedOption] = useState(-1);
  const [animateSearch, setAnimateSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if there's a saved preference in localStorage
    const savedPreference = localStorage.getItem('darkMode');
    // Check system preference if no saved preference
    if (savedPreference === null) {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    // Otherwise use saved preference
    return savedPreference === 'true';
  });
  const [historicalData, setHistoricalData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isFetchingCrypto, setIsFetchingCrypto] = useState(false);
  const [calculationStarted, setCalculationStarted] = useState(false);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [cryptoList, setCryptoList] = useState([]);

  // State for enhanced search features
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Enter cryptocurrency name or symbol (e.g., Bitcoin, BTC)');
  const [popularSearches, setPopularSearches] = useState([
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', trend: '+2.3%', trending: true },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', trend: '+1.8%', trending: true },
    { id: 'solana', name: 'Solana', symbol: 'SOL', trend: '+4.2%', trending: true },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', trend: '-0.5%', trending: false },
    { id: 'ripple', name: 'Ripple', symbol: 'XRP', trend: '-1.2%', trending: false }
  ]);

  const [showPredictionResults, setShowPredictionResults] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [showCryptoDetails, setShowCryptoDetails] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const theme = useTheme();

  // Fix the fetchCoins placement issue - move this inside useEffect
  useEffect(() => {
    // Save dark mode preference to localStorage whenever it changes
    localStorage.setItem('darkMode', isDarkMode);
    
    // Apply dark mode class to document body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    // Store the user's preference in local storage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }

    // Fetch coins from the backend on initial load
    const loadCoins = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/coins`);
        const data = await response.json();
        if (data.success && data.coins) {
          setPopularSearches(
            data.coins.slice(0, 5).map(coin => ({
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol,
              trend: coin.change_24h ? `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h?.toFixed(1)}%` : '+0.0%',
              trending: true,
              image: coin.image
            }))
          );
          setCryptoList(data.coins);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setSearchInProgress(false);
      }
    };

    loadCoins();

    // Center alignment fix: Set body and html to 100% height for proper centering
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    
    const timer = setTimeout(() => {
      setIsFullyLoaded(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      // Reset body styles when component unmounts
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.display = '';
      document.body.style.flexDirection = '';
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value || '';
    setSearchQuery(value);
    
    // Filter crypto list based on search query
    if (value.trim()) {
      const filteredResults = cryptoList.filter(crypto => {
        const nameMatch = crypto.name?.toLowerCase().includes(value.toLowerCase());
        const symbolMatch = crypto.symbol?.toLowerCase().includes(value.toLowerCase());
        return nameMatch || symbolMatch;
      }).slice(0, 10); // Limit to 10 results for better UX
      
      setSearchResults(filteredResults);
      setShowAutocomplete(true);
      setShowRecentSearches(false);
      setHighlightedOption(0);
    } else {
      setSearchResults([]);
      setShowAutocomplete(false);
      setShowRecentSearches(recentSearches.length > 0);
    }
  };

  const handleOptionSelect = async (crypto) => {
    if (!crypto || !crypto.symbol) {
      console.error('Invalid crypto object:', crypto);
      return;
    }
  
    setSearchQuery(crypto.name || '');
    setShowAutocomplete(false);
    setShowRecentSearches(false);
  
  // Show loading state
  setIsFetchingCrypto(true);
  
  // Use ID if available, otherwise use symbol
    const symbolToUse = crypto.id || crypto.symbol.toLowerCase();
    setSelectedCryptoSymbol(symbolToUse);
  setDebugLog(prev => [...prev, `Fetching data for: ${symbolToUse}`]);
  
  try {
    // Fetch real data from backend
    const details = await fetchCryptoDetails(symbolToUse);
    
    if (details.success) {
      // Create result object that matches the UI structure
      const resultData = {
        id: details.id || crypto.id || symbolToUse,
        name: details.name || crypto.name,
        symbol: details.symbol || crypto.symbol,
        price: `$${Number(details.current_price).toLocaleString()}`,
        change: `${details.price_change_percentage_24h > 0 ? '+' : ''}${details.price_change_percentage_24h?.toFixed(1)}%`,
        isPositive: details.price_change_percentage_24h > 0,
        marketCap: `$${(details.market_cap / 1000000000).toFixed(1)}B`,
        volume: `$${(details.total_volume / 1000000000).toFixed(1)}B`,
        // Store all backend data for detailed view
        ...details
      };
      
      // Update state with backend data
      setResults(resultData);
      setSelectedCrypto(resultData);
      
      // Set historical data for chart
      if (details.price_history && details.price_history.length > 0) {
        const formattedHistory = details.price_history.map(item => ({
          date: new Date(item.date),
          price: item.price
        }));
        setHistoricalData(formattedHistory);
        
        // Calculate 30-day trend percentage for chart header
        if (formattedHistory.length >= 2) {
          const oldestPrice = formattedHistory[0].price;
          const latestPrice = formattedHistory[formattedHistory.length - 1].price;
          const trendPercentage = ((latestPrice - oldestPrice) / oldestPrice) * 100;
          resultData.trendPercentage = trendPercentage.toFixed(2);
        }
      }
      
      setDebugLog(prev => [...prev, `Successfully loaded data for ${details.name}`]);
    } else {
      setError('Failed to fetch crypto details: ' + (details.error || 'Unknown error'));
      // Fall back to mock data if real data fails
      setResults(crypto);
    }
  } catch (error) {
    setError('Failed to fetch crypto details: ' + error.message);
    // Fall back to mock data if API call fails
    setResults(crypto);
  } finally {
    setIsFetchingCrypto(false);
    setShowCryptoDetails(true);
  }
  };

  const handleKeyDown = (e) => {
    if (!showAutocomplete || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedOption(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedOption(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedOption >= 0) {
          handleOptionSelect(searchResults[highlightedOption]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        break;
      default:
        break;
    }
  };

  const handleClickAway = () => {
    setShowAutocomplete(false);
  };

  // Handle search focus and blur with enhanced feedback
  const handleSearchFocus = () => {
    setAnimateSearch(true);
    setSearchFocused(true);
    setShowRecentSearches(recentSearches.length > 0 && searchQuery.trim().length === 0);

    // Cycle through different placeholder texts
    const placeholders = [
      'Search cryptocurrencies like Bitcoin, Ethereum...',
      'Try searching by symbol: BTC, ETH, SOL...',
      'Discover trending cryptocurrencies...',
      'Find detailed price predictions...'
    ];

    let index = 0;
    const interval = setInterval(() => {
      setSearchPlaceholder(placeholders[index]);
      index = (index + 1) % placeholders.length;
    }, 3000);

    return () => clearInterval(interval);
  };

  const handleSearchBlur = () => {
    setAnimateSearch(false);
    // Small delay to allow clicking on the dropdown items
    setTimeout(() => {
      setSearchFocused(false);
      setSearchPlaceholder('Enter cryptocurrency name or symbol (e.g., Bitcoin, BTC)');
    }, 200);
  };

  const handlePopularSearch = (crypto) => {
    handleOptionSelect(crypto);
  };

  const handleRecentSearchClear = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    setShowRecentSearches(false);
  };

  const handleRecentSearchSelect = (crypto) => {
    handleOptionSelect(crypto);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery?.trim()) return;

    setLoading(true);
    setError(null);
    setAnimateSearch(true);
    setSearchInProgress(true);

    try {
      const formattedSymbol = (searchQuery || '').toUpperCase().replace(/\\s+/g, '');
      const coinSymbol = formattedSymbol.includes('-USD') ? formattedSymbol : `${formattedSymbol}-USD`;

      const response = await fetchPrediction(coinSymbol);

      if (response?.success) {
        const formattedData = {
          currentPrice: response.last_close,
          predictedPrice: response.predictions[response.predictions.length - 1].Predicted_Price,
          predictedChange: ((response.predictions[response.predictions.length - 1].Predicted_Price - response.last_close) / response.last_close * 100).toFixed(2),
          potentialReturn: (response.predictions[response.predictions.length - 1].Predicted_Price - response.last_close) * (investmentAmount || 1000),
          potentialROI: ((response.predictions[response.predictions.length - 1].Predicted_Price - response.last_close) / response.last_close * 100).toFixed(2),
          marketSentiment: response.predictions[response.predictions.length - 1].Predicted_Price > response.last_close ? 'Bullish' : 'Bearish',
          optimisticPrice: response.predictions[response.predictions.length - 1].Upper_Bound,
          pessimisticPrice: response.predictions[response.predictions.length - 1].Lower_Bound
        };

        setPredictionData(formattedData);
        setShowPredictionResults(true);
      } else {
        throw new Error(response?.error || 'Failed to get prediction');
      }
    } catch (error) {
      setError(error.message);
      setApiError(error.message);
    } finally {
      setLoading(false);
      setSearchInProgress(false);
      setAnimateSearch(false);
    }
  };

  const generateMockHistoricalData = (symbol, days) => {
    if (!symbol) return [];
    
    const data = [];
    const today = new Date();
    let basePrice;

    switch ((symbol || '').toUpperCase()) {
      case 'BTC': basePrice = 43000; break;
      case 'ETH': basePrice = 3200; break;
      case 'ADA': basePrice = 1.10; break;
      case 'SOL': basePrice = 100; break;
      case 'XRP': basePrice = 0.75; break;
      case 'DOT': basePrice = 18; break;
      default: basePrice = 100;
    }

    // Seed for more realistic price movements
    let price = basePrice;
    let trend = Math.random() > 0.5 ? 1 : -1;
    let trendStrength = Math.random() * 0.02 + 0.01;
    let trendDuration = Math.floor(Math.random() * 5) + 3;
    let trendDay = 0;

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      if (trendDay >= trendDuration) {
        trend = -trend;
        trendStrength = Math.random() * 0.02 + 0.01;
        trendDuration = Math.floor(Math.random() * 5) + 3;
        trendDay = 0;
      }

      const volatility = 0.02;
      const randomChange = (Math.random() * volatility * 2) - volatility;
      const changePercent = (trendStrength * trend) + randomChange;

      if (i === days) {
        data.push({
          date: date.toISOString().split('T')[0],
          price: price
        });
      } else {
        price = price * (1 + changePercent);
        data.push({
          date: date.toISOString().split('T')[0],
          price: price
        });
      }

      trendDay++;
    }

    return data;
  };

  const calculatePrediction = async () => {
    if (!selectedCrypto) {
        setError('Please select a cryptocurrency first');
        return;
    }

    try {
        setCalculationStarted(true);
        setError(null);

        // Format coin symbol
        const coinSymbol = selectedCrypto.symbol.toUpperCase();
        const formattedSymbol = coinSymbol.includes('-USD') ? coinSymbol : `${coinSymbol}-USD`;

        // Get prediction data from backend
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                coin_symbol: formattedSymbol,
                lookback: 60,
                future_days: selectedTimeframe === '1d' ? 1 : 
                           selectedTimeframe === '7d' ? 7 :
                           selectedTimeframe === '30d' ? 30 :
                           selectedTimeframe === '90d' ? 90 : 365,
                mc_samples: 100,
                train_new_model: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (!responseData.success) {
            throw new Error(responseData.error || 'Prediction failed');
        }

        // Calculate potential returns
        const lastPrice = responseData.last_close;
        const predictedPrice = responseData.predictions[0].Predicted_Price;
        const priceChange = ((predictedPrice - lastPrice) / lastPrice) * 100;
        const potentialReturn = (investmentAmount * (1 + priceChange / 100)).toFixed(2);

        // Update state with prediction results
        setResults({
            ...responseData,
            potentialReturn,
            priceChange,
            investmentAmount
        });

        // Format prediction data for display
        const formattedData = {
            currentPrice: lastPrice,
            predictedPrice: predictedPrice,
            predictedChange: priceChange.toFixed(2),
            potentialReturn: potentialReturn,
            potentialROI: priceChange.toFixed(2),
            marketSentiment: priceChange > 0 ? 'Bullish' : 'Bearish',
            optimisticPrice: responseData.predictions[0].Upper_Bound,
            pessimisticPrice: responseData.predictions[0].Lower_Bound
        };

        setPredictionData(formattedData);
        setShowPredictionResults(true);

    } catch (error) {
        console.error('Prediction error:', error);
        setError(error.message || 'Failed to calculate prediction');
    } finally {
        // Stop animations and reset states
        setCalculationStarted(false);
        setLoading(false);
    }
};

  const calculateHistoryFactor = (histData) => {
    if (!histData || histData.length < 2) return 0;

    const recentPrices = histData.slice(-7);
    if (recentPrices.length < 2) return 0;

    let totalChangePercent = 0;
    for (let i = 1; i < recentPrices.length; i++) {
      const prevPrice = recentPrices[i - 1].price;
      const currPrice = recentPrices[i].price;
      const changePercent = (currPrice - prevPrice) / prevPrice;
      totalChangePercent += changePercent;
    }

    const avgChangePercent = totalChangePercent / (recentPrices.length - 1);
    return avgChangePercent * 2;
  };

  const calculateMarketSentiment = (crypto) => {
    if (!crypto || !crypto.change) return 0;

    const changePercent = parseFloat(crypto.change.replace(/[^-\d.]/g, '')) / 100;
    return changePercent * 0.5;
  };

  const formatTimeframe = (tf) => {
    switch (tf) {
      case '1d': return '24 Hours';
      case '7d': return '7 Days';
      case '30d': return '30 Days';
      case '90d': return '90 Days';
      case '1y': return '1 Year';
      default: return tf;
    }
  };

  const handleChartAnimationComplete = () => {
    setChartAnimationComplete(true);
  };

  const triggerMetricAnimation = (metric) => {
    setHighlightedMetric(metric);
    setTimeout(() => setHighlightedMetric(null), 1000);
  };

  const handleCardsTransitionEnd = () => {
    if (chartAnimationComplete) {
      triggerMetricAnimation('price');
    }
  };

  const handleTimeframeChange = (e) => {
    const newTimeframe = e.target.value;
    setActiveTimeframe(newTimeframe);
    setSelectedTimeframe(newTimeframe);

    setInputAnimation(true);
    setTimeout(() => setInputAnimation(false), 700);
  };

  const AnimatedNumberWithFallback = ({ value, ...props }) => {
    try {
      if (typeof AnimatedNumber === 'function') {
        return <AnimatedNumber value={value} {...props} />;
      } else {
        return <SimpleAnimatedNumber value={value} {...props} />;
      }
    } catch (error) {
      console.error("Error rendering AnimatedNumber:", error);
      return <SimpleAnimatedNumber value={value} {...props} />;
    }
  };

  const PredictionBadge = ({ value, title, subtitle, type, icon }) => {
    const getStyles = () => {
      switch (type) {
        case 'success':
          return {
            gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.15) 100%)',
            color: '#10b981',
            borderColor: 'rgba(16, 185, 129, 0.3)'
          };
        case 'error':
          return {
            gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.15) 100%)',
            color: '#ef4444',
            borderColor: 'rgba(239, 68, 68, 0.3)'
          };
        case 'primary':
          return {
            gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.15) 100%)',
            color: '#3b82f6',
            borderColor: 'rgba(59, 130, 246, 0.3)'
          };
        default:
          return {
            gradient: 'linear-gradient(135deg, rgba(107, 114, 128, 0.05) 0%, rgba(75, 85, 99, 0.15) 100%)',
            color: '#6b7280',
            borderColor: 'rgba(107, 114, 128, 0.3)'
          };
      }
    };

    const styles = getStyles();

    return (
      <Box
        className="prediction-badge"
        sx={{
          background: styles.gradient,
          borderLeft: `4px solid ${styles.color}`,
          borderRadius: '12px',
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <Box className="badge-sparkle"></Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: styles.color,
            my: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {value}
          {icon}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    );
  };

  // Add this new component for calculation in progress
  const CalculationInProgress = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 400);

      return () => clearInterval(interval);
    }, []);

    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.7)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.3s ease-out forwards'
        }}
      >
        <Box
          sx={{
            width: { xs: '90%', sm: '400px' },
            backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(226, 232, 240, 1)',
            animation: 'fadeAndScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <Box sx={{ position: 'relative', width: 80, height: 80 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid',
                borderColor: 'divider',
                borderTopColor: 'primary.main',
                animation: 'spin 1.5s linear infinite',
                position: 'absolute'
              }}
            />
            <Box
              component="span"
              className="material-icons-outlined"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 30,
                color: 'primary.main',
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            >
              insights
            </Box>
          </Box>

          <Typography variant="h6" fontWeight="bold" textAlign="center">
            AI Prediction in Progress{dots}
          </Typography>

          <Box sx={{ width: '100%', position: 'relative', height: 6, bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '30%',
                background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                borderRadius: 3,
                animation: 'progressBar 2s infinite'
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Analyzing market data and generating price prediction based on AI models. This might take a moment.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 1,
              opacity: 0.7,
              animation: 'fadeIn 0.5s forwards 1s'
            }}
          >
            <Chip
              size="small"
              label="Historical trends"
              sx={{ opacity: 0.8 }}
            />
            <Chip
              size="small"
              label="Market sentiment"
              sx={{ opacity: 0.8 }}
            />
            <Chip
              size="small"
              label="Risk analysis"
              sx={{ opacity: 0.8 }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  return (
    <Router>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#121212' : '#f5f7fa',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        cursor: 'none', // Hide default cursor
      }}>
        <CustomCursor />
        <ParticleBackground isDarkMode={isDarkMode} />

        {/* Properly connected navbar with toggle dark mode functionality */}
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          notificationCount={notificationCount}
          handleNotificationsClick={handleNotificationsClick}
          handleUserMenuClick={handleUserMenuClick}
        />

        {/* Add calculation progress indicator */}
        {calculationStarted && <CalculationInProgress />}

        <Routes>
          <Route path="/" element={
            <Box component="main" 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                flexGrow: 1, 
                width: '100%',
                alignItems: 'center'
              }}
            >
              {/* App header section with proper centering */}
              <Box
                className="app-header"
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  // Adjusted padding to account for navbar height instead of adding Toolbar
                  pt: { xs: '72px', md: '80px' },
                  pb: { xs: 8, md: 12 },
                  background: isDarkMode ? 
                    'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 
                    'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 30%, rgba(129, 140, 248, 0.4) 0%, rgba(0, 0, 0, 0) 70%)',
                    zIndex: 1
                  }
                }}
              >
                <Container maxWidth="md">
                  <Box className="header-content" sx={{ position: 'relative', zIndex: 2 }}>
                    <Box className="logo-container" sx={{ textAlign: 'center', mb: { xs: 5, md: 6 }, mt: { xs: 5, md: 8 } }}>
                      <Typography
                        variant="h3"
                        className="app-logo"
                        sx={{
                          fontWeight: 900,
                          fontSize: { xs: '3rem', md: '4rem' },
                          letterSpacing: '-0.04em',
                          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          color: 'white',
                          mb: 0
                        }}
                      >
                        <Box
                          className="logo-highlight-effect"
                          sx={{
                            position: 'absolute',
                            width: '150%',
                            height: '150%',
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
                            borderRadius: '50%',
                            animation: 'pulse 4s infinite ease-in-out',
                            top: '100%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: -1,
                            filter: 'blur(10px)'
                          }}
                        />
                        Crypto<span className="gradient-text" sx={{
                          background: 'linear-gradient(to right, #ffffff, #c7d2fe)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          position: 'relative'
                        }}>Predict</span>
                        <Box
                          component="span"
                          className="logo-dot"
                          sx={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ffffff, #93c5fd)',
                            ml: 1,
                            mb: 2,
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                            animation: 'pulseDot 3s infinite ease-in-out'
                          }}
                        />
                      </Typography>

                      <Box
                        className="logo-subtitle"
                        sx={{
                          mt: 2,
                          opacity: 0,
                          animation: 'fadeIn 0.7s ease-out forwards 0.7s',
                          position: 'relative'
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: 'rgba(255,255,255,0.9)',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            fontWeight: 600,
                            position: 'relative',
                            display: 'inline-block',
                            padding: '0 20px',
                            '&::before, &::after': {
                              content: '""',
                              position: 'absolute',
                              top: '50%',
                              width: '15px',
                              height: '2px',
                              backgroundColor: 'rgba(255,255,255,0.6)'
                            },
                            '&::before': {
                              left: 0
                            },
                            '&::after': {
                              right: 0
                            }
                          }}
                        >
                          Powered by advanced machine learning
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className="tagline-container"
                      sx={{
                        position: 'relative',
                        textAlign: 'center',
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: 6
                      }}
                    >
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{
                          color: 'rgba(255,255,255,0.95)',
                          mb: 4,
                          fontWeight: 700,
                          textShadow: '0 4px 15px rgba(0,0,0,0.3)',
                          lineHeight: 1.5,
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          position: 'relative',
                          display: 'inline-block'
                        }}
                        className="tagline-text"
                      >
                        AI-Powered Price Predictions for Cryptocurrency Markets
                        <Box
                          className="tagline-underline"
                          sx={{
                            position: 'absolute',
                            bottom: -12,
                            left: '5%',
                            width: '90%',
                            height: 3,
                            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))',
                            borderRadius: '3px',
                            animation: 'shimmer 3s infinite',
                            filter: 'blur(1px)'
                          }}
                        />
                      </Typography>

                      <Box
                        className="header-stats-bar"
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: { xs: 4, sm: 8 },
                          flexWrap: 'wrap',
                          mt: 6,
                          mx: 'auto',
                          maxWidth: '700px'
                        }}
                      >
                        {[
                          { label: 'Cryptocurrencies', value: '500+', icon: 'currency_bitcoin', delay: 0 },
                          { label: 'Accuracy', value: '94%', icon: 'verified', delay: 0.2 },
                          { label: 'Data Points', value: '1M+', icon: 'insights', delay: 0.4 }
                        ].map((stat, index) => (
                          <Box
                            key={index}
                            sx={{
                              textAlign: 'center',
                              position: 'relative',
                              opacity: 0,
                              transform: 'translateY(20px)',
                              animation: 'slideUp 0.8s forwards',
                              animationDelay: `${0.8 + stat.delay}s`,
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-5px) scale(1.05)'
                              }
                            }}
                            className="header-stat"
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 1.5
                              }}
                            >
                              <Box
                                sx={{
                                  width: { xs: '60px', md: '70px' },
                                  height: { xs: '60px', md: '70px' },
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(255, 255, 255, 0.15)',
                                  backdropFilter: 'blur(10px)',
                                  mb: 1.5,
                                  position: 'relative',
                                  overflow: 'hidden',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                                }}
                                className="stat-icon-bg"
                              >
                                <Box
                                  component="span"
                                  className="material-icons-outlined"
                                  sx={{ 
                                    fontSize: { xs: 30, md: 36 }, 
                                    color: 'white',
                                    animation: 'pulse 2s infinite ease-in-out',
                                    animationDelay: `${0.5 * index}s`
                                  }}
                                >
                                  {stat.icon}
                                </Box>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 70%)',
                                    animation: 'shimmerBg 4s infinite linear',
                                    zIndex: 1
                                  }}
                                />
                              </Box>

                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 800,
                                  color: 'white',
                                  fontSize: { xs: '2rem', md: '2.5rem' },
                                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                }}
                                className="stat-value-animate"
                              >
                                {stat.value}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'rgba(255,255,255,0.9)',
                                  fontWeight: 500,
                                  fontSize: '1rem',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                {stat.label}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>

                      <Box
                        className="header-cta"
                        sx={{
                          mt: 7,
                          display: 'flex',
                          justifyContent: 'center',
                          opacity: 0,
                          animation: 'fadeIn 0.7s forwards 1.4s'
                        }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
                          sx={{
                            borderRadius: '50px',
                            px: 5,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            background: 'rgba(255,255,255,0.9)',
                            color: '#1e40af',
                            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.4s ease',
                            textTransform: 'none',
                            '&:hover': {
                              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                              transform: 'translateY(-5px) scale(1.05)',
                              background: 'white'
                            }
                          }}
                          className="btn-header-cta"
                        >
                          <Box component="span" className="material-icons-outlined" sx={{ mr: 1, fontSize: 24 }}>
                            search
                          </Box>
                          Start Prediction
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(120deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))',
                              transform: 'translateX(-100%)',
                              animation: 'btnShine 3s infinite 2s'
                            }}
                            className="btn-shine"
                          />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Container>

                <Box className="header-floating-elements" sx={{ pointerEvents: 'none' }}>
                  <Box className="floating-circle circle1" sx={{ 
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 70%)',
                    top: '-100px',
                    right: '-100px',
                    filter: 'blur(40px)',
                    animation: 'floatSlow 15s infinite ease-in-out'
                  }}></Box>
                  
                  <Box className="floating-circle circle2" sx={{ 
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)',
                    bottom: '-50px',
                    left: '15%',
                    filter: 'blur(30px)',
                    animation: 'floatSlow 12s infinite ease-in-out 2s'
                  }}></Box>
                  
                  <Box className="floating-circle circle3" sx={{ 
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0) 70%)',
                    top: '20%',
                    left: '10%',
                    filter: 'blur(20px)',
                    animation: 'floatSlow 20s infinite ease-in-out 1s'
                  }}></Box>
                  
                  <Box className="floating-element coin1" sx={{
                    position: 'absolute',
                    right: '15%',
                    top: '25%',
                    animation: 'floatCoin 6s infinite ease-in-out'
                  }}>
                    <Box className="coin-icon bitcoin-icon" sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#f7931a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(247, 147, 26, 0.5)',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Box component="span" className="material-icons-outlined" sx={{ color: 'white', fontSize: '32px' }}>
                        currency_bitcoin
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box className="floating-element coin2" sx={{
                    position: 'absolute',
                    left: '20%',
                    top: '60%',
                    animation: 'floatCoin 8s infinite ease-in-out 0.5s'
                  }}>
                    <Box className="coin-icon ethereum-icon" sx={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#627eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(98, 126, 234, 0.5)',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Box component="span" className="material-icons-outlined" sx={{ color: 'white', fontSize: '22px' }}>
                        currency_exchange
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box className="floating-element coin3" sx={{
                    position: 'absolute',
                    right: '25%',
                    bottom: '20%',
                    animation: 'floatCoin 10s infinite ease-in-out 1s'
                  }}>
                    <Box className="coin-icon alt-icon" sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(124, 58, 237, 0.5)',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Box component="span" className="material-icons-outlined" sx={{ color: 'white', fontSize: '18px' }}>
                        token
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box className="floating-element chart-icon" sx={{
                    position: 'absolute',
                    left: '60%',
                    top: '30%',
                    animation: 'floatElement 15s infinite ease-in-out'
                  }}>
                    <Box sx={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transform: 'rotate(-10deg)'
                    }}>
                      <ShowChart sx={{ color: 'white', fontSize: 38 }} />
                    </Box>
                  </Box>
                  
                  <Box className="floating-element analytics-icon" sx={{
                    position: 'absolute',
                    left: '70%',
                    bottom: '15%',
                    animation: 'floatElement 12s infinite ease-in-out 2s'
                  }}>
                    <Box sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transform: 'rotate(5deg)'
                    }}>
                      <Box component="span" className="material-icons-outlined" sx={{ color: 'white', fontSize: 32 }}>
                        analytics
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box className="header-light-rays" sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%)',
                    pointerEvents: 'none'
                  }}></Box>
                </Box>
                
                <Box className="header-bottom-wave" sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  overflow: 'hidden',
                  lineHeight: 0,
                  transform: 'rotate(180deg)'
                }}>
                  <Box 
                    className="dynamic-waves-container"
                    sx={{
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      width: '100%',
                      height: '150px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      className="wave wave1" 
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '200%',
                        height: '100%',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='${isDarkMode ? "%23121212" : "%23f5f7fa"}'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='${isDarkMode ? "%23121212" : "%23f5f7fa"}'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='${isDarkMode ? "%23121212" : "%23f5f7fa"}'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: '1200px 100%',
                        backgroundRepeat: 'repeat-x',
                        animation: 'wave-animation 15s linear infinite'
                      }}
                    />
                    <Box 
                      className="wave wave2" 
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '200%',
                        height: '100%',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='${isDarkMode ? "%23121212" : "%23f5f7fa"}'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: '1200px 100%',
                        backgroundRepeat: 'repeat-x',
                        animation: 'wave-animation-reverse 12s linear infinite'
                      }}
                    />
                    <Box 
                      className="wave wave3" 
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '200%',
                        height: '100%',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='${isDarkMode ? "%23121212" : "%23f5f7fa"}'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: '1200px 100%',
                        backgroundRepeat: 'repeat-x',
                        animation: 'wave-animation 10s linear infinite'
                      }}
                    />
                    <Box 
                      className="crypto-waves-overlay"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='0.25' d='M0,10 L10,15 L20,5 L30,10 L40,5 L50,15 L60,10 L70,5 L80,10 L90,5 L100,10'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: '100px 20px',
                        backgroundRepeat: 'repeat',
                        opacity: 0.6,
                        animation: 'price-wave 8s linear infinite'
                      }}
                    />
                    <Box
                      className="particles-overlay"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                      }}
                    >
                      {[...Array(20)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            position: 'absolute',
                            width: Math.random() * 6 + 2,
                            height: Math.random() * 6 + 2,
                            backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`,
                            borderRadius: '50%',
                            bottom: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `floatWithBounce ${Math.random() * 6 + 4}s infinite ease-in-out ${Math.random() * 5}s`
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* ...rest of home page content... */}
              {showInfoBanner && (
                <Box sx={{ width: '100%', mb: 4 }}>
                  <div style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
                    <Alert
                      severity="info"
                      className="info-banner"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => setShowInfoBanner(false)}
                          className="close-button-pulse"
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      }
                    >
                      Search for a cryptocurrency by name or symbol to get price predictions based on AI analysis.
                    </Alert>
                  </div>
                </Box>
              )}

              <Container 
                maxWidth="md" 
                id="search-section"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  px: { xs: 2, sm: 3 }
                }}
              >
                <div style={{ animation: 'fadeIn 0.7s ease-out forwards', opacity: 0, width: '100%' }}>
                  <Paper 
                    elevation={0} 
                    className={`search-paper ${animateSearch ? 'search-paper-focus' : ''}`}
                    sx={{ 
                      width: '100%',
                      mx: 'auto',
                      borderRadius: '16px',
                      p: 3,
                      boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Box
                      component="form"
                      onSubmit={handleSearch}
                      className="search-box"
                      sx={{ mb: 4 }}
                    >
                      <Typography
                        variant="h5"
                        className="search-title animate-text-gradient"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          color: isDarkMode ? '#fff' : '#1e40af',
                          mb: 2
                        }}
                      >
                        Get Price Predictions
                      </Typography>

                      <ClickAwayListener onClickAway={handleClickAway}>
                        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                          <TextField
                            fullWidth
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            inputRef={searchInputRef}
                            autoComplete="off"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search color="primary" className={`search-icon ${searchFocused ? 'search-icon-pulse' : ''}`} />
                                </InputAdornment>
                              ),
                              endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="clear search"
                                    onClick={() => {
                                      setSearchQuery('');
                                      setSearchResults([]);
                                      setShowAutocomplete(false);
                                      setShowRecentSearches(recentSearches.length > 0);
                                    }}
                                    edge="end"
                                    size="small"
                                    className="clear-search-button"
                                  >
                                    <Close fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                              className: `search-input ${searchFocused ? 'search-input-focused' : ''} ${searchInProgress ? 'search-in-progress' : ''}`,
                              sx: {
                                bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                                '& input': {
                                  color: isDarkMode ? '#fff' : '#1e293b',
                                }
                              }
                            }}
                            variant="outlined"
                          />

                          <Box className={`search-focus-ripple ${searchFocused ? 'ripple-active' : ''}`}></Box>

                          {searchFocused && !showAutocomplete && !showRecentSearches && (
                            <Paper
                              className="search-suggestions-dropdown"
                              elevation={3}
                              sx={{
                                position: 'absolute',
                                width: '100%',
                                mt: 0.5,
                                zIndex: 10,
                                borderRadius: '12px',
                                border: '1px solid rgba(59, 130, 246, 0.1)',
                                p: 2.5,
                                animation: 'fadeIn 0.3s ease-out'
                              }}
                            >
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  mb: 2.5, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  fontSize: '1rem',
                                  fontWeight: 600 
                                }}
                              >
                                <TrendingUp fontSize="small" color="primary" />
                                Popular Cryptocurrencies
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                {popularSearches.map((crypto) => (
                                  <Chip
                                    key={crypto.id}
                                    avatar={crypto.image ? <Avatar src={crypto.image} /> : null}
                                    label={
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        py: 0.5,
                                        px: 0.25
                                      }}>
                                        <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>{crypto.symbol}</Typography>
                                        <Typography 
                                          variant="caption" 
                                          component="span" 
                                          sx={{ 
                                            color: crypto.trend.startsWith('+') ? 'success.main' : 'error.main',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.25
                                          }}
                                        >
                                          {crypto.trend.startsWith('+') ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                                          {crypto.trend}
                                        </Typography>
                                      </Box>
                                    }
                                    onClick={() => handlePopularSearch(crypto)}
                                    sx={{
                                      p: 0.75,
                                      height: 'auto',
                                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                      border: '1px solid',
                                      borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                                      '&:hover': {
                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                                        transform: 'translateY(-2px)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  />
                                ))}
                              </Box>
                            </Paper>
                          )}

                          {showRecentSearches && recentSearches.length > 0 && (
                            <Paper
                              className="recent-searches-dropdown"
                              elevation={3}
                              sx={{
                                position: 'absolute',
                                width: '100%',
                                mt: 0.5,
                                zIndex: 10,
                                borderRadius: '12px',
                                border: '1px solid rgba(59, 130, 246, 0.1)',
                                animation: 'fadeIn 0.2s ease-out forwards'
                              }}
                            >
                              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box component="span" className="material-icons-outlined" sx={{ fontSize: 16 }}>
                                    history
                                  </Box>
                                  Recent Searches
                                </Typography>
                                
                                <Button size="small" onClick={handleRecentSearchClear} color="inherit" sx={{ fontSize: '0.75rem' }}>
                                  Clear All
                                </Button>
                              </Box>
                              
                              <Divider />
                              
                              <List dense sx={{ maxHeight: '200px', overflow: 'auto' }}>
                                {recentSearches.map((item, index) => (
                                  <ListItem 
                                    key={index} 
                                    button 
                                    onClick={() => handleRecentSearchSelect(item)}
                                    sx={{
                                      '&:hover': {
                                        bgcolor: 'rgba(59, 130, 246, 0.08)',
                                      }
                                    }}
                                  >
                                    <ListItemAvatar>
                                      <Avatar 
                                        src={item.image || `https://cryptologos.cc/logos/${item.id || 'default'}-logo.png`} 
                                        alt={item.name} 
                                        sx={{ width: 24, height: 24 }}
                                      />
                                    </ListItemAvatar>
                                    <ListItemText 
                                      primary={item.name} 
                                      secondary={item.symbol} 
                                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          )}

                          <Fade in={showAutocomplete && searchResults.length > 0}>
                            <Paper
                              className="autocomplete-dropdown"
                              elevation={3}
                              sx={{
                                position: 'absolute',
                                width: '100%',
                                mt: 0.5,
                                maxHeight: '350px',
                                overflowY: 'auto',
                                zIndex: 10,
                                borderRadius: '12px',
                                border: '1px solid rgba(59, 130, 246, 0.1)',
                              }}
                            >
                              <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box component="span" className="material-icons-outlined" sx={{ fontSize: 16 }}>
                                    search
                                  </Box>
                                  Search Results
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Found {searchResults.length} results
                                </Typography>
                              </Box>
                              <Divider />
                              <List component="nav" dense>
                                {searchResults.map((crypto, index) => (
                                  <ListItem
                                    key={crypto?.id || index}
                                    button
                                    selected={highlightedOption === index}
                                    onClick={() => handleOptionSelect(crypto)}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                                      },
                                      '&.Mui-selected': {
                                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                                      }
                                    }}
                                  >
                                    <ListItemAvatar>
                                      <Avatar
                                        src={crypto?.image || `https://cryptologos.cc/logos/${crypto?.id || 'default'}-logo.png`}
                                        alt={crypto?.name || 'Crypto'}
                                        sx={{ width: 32, height: 32 }}
                                      />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                          <Typography variant="body1" component="span" sx={{ fontWeight: 600 }}>
                                            {crypto?.name || 'Unknown'}
                                          </Typography>
                                          {crypto?.price && (
                                            <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                                              ${crypto?.price?.toLocaleString()}
                                            </Typography>
                                          )}
                                        </Box>
                                      }
                                      secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                              label={crypto?.symbol || 'N/A'}
                                              size="small"
                                              sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                            {crypto?.market_cap_rank && (
                                              <Chip
                                                label={`Rank #${crypto.market_cap_rank}`}
                                                size="small"
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                              />
                                            )}
                                          </Box>
                                          
                                          {crypto?.change_24h && (
                                            <Chip
                                              label={`${crypto.change_24h > 0 ? '+' : ''}${crypto.change_24h.toFixed(2)}%`}
                                              size="small"
                                              className={crypto?.isPositive ? "positive-change" : "negative-change"}
                                              icon={crypto?.isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                                              sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                          )}
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          </Fade>
                        </Box>
                      </ClickAwayListener>

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        className={`search-button ${loading ? 'search-button-loading' : ''}`}
                        disableElevation
                        disabled={loading || !searchQuery.trim()}
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1rem',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)'
                        }}
                      >
                        {loading ? (
                          <Box className="loading-spinner-container">
                            <CircularProgress size={24} color="inherit" className="loading-spinner" />
                            <span className="loading-text">Searching...</span>
                          </Box>
                        ) : (
                          <>
                            <span className="button-text">Search</span>
                            <span className="button-hover-effect"></span>
                          </>
                        )}
                      </Button>
                    </Box>
                  </Paper>
                </div>

                {apiError && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out forwards' }}>
                    <Alert severity="error" sx={{ mb: 4 }} className="error-alert">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudOff fontSize="small" />
                        <Typography variant="body2">{apiError}</Typography>
                      </Box>
                    </Alert>
                  </div>
                )}

                {error && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out forwards' }}>
                    <Alert severity="error" sx={{ mb: 4 }} className="error-alert">
                      {error}
                    </Alert>
                  </div>
                )}

                {isFetchingCrypto && (
                  <Box sx={{ mb: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} />
                        <Box sx={{ width: '100%' }}>
                          <Skeleton variant="text" width="60%" height={40} />
                          <Skeleton variant="text" width="40%" height={30} />
                        </Box>
                      </Box>
                      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 2 }} />
                      <Grid container spacing={2}>
                        {[1, 2, 3, 4].map((item) => (
                          <Grid item xs={6} md={3} key={item}>
                            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Box>
                )}

                {results && (
                  <Box className="results-container animate-slide-in-bottom">
                    <div style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
                      <Paper elevation={0} className="crypto-result-card">
                        <Box className="crypto-header-content">
                          <Box className="crypto-info-section">
                            <Avatar
                              src={`https://cryptologos.cc/logos/${results?.id || 'default'}-logo.png?v=023`}
                              alt={results?.name || 'Crypto'}
                              className="crypto-logo animate-float"
                              sx={{ width: 64, height: 64, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h4" className="crypto-name animate-text-gradient">{results.name}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip label={results.symbol} size="small" className="symbol-chip" />
                                <Chip
                                  label={results.change}
                                  size="small"
                                  className={`${results.isPositive ? "positive-change" : "negative-change"} pulse-chip`}
                                  icon={results.isPositive ? <TrendingUp fontSize="small" className="trend-icon" /> : <TrendingDown fontSize="small" className="trend-icon" />}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box className="crypto-price-section">
                            <Typography variant="h4" className="crypto-price price-animate">{results.price}</Typography>
                          </Box>
                        </Box>

                        <Grid container spacing={3} sx={{ mt: 2 }} className="stat-grid">
                          {[
                            { title: "Market Cap", value: results.marketCap, delay: 0.1 },
                            { title: "24h Volume", value: results.volume, delay: 0.2 },
                            { title: "24h Change", value: results.change, color: results.isPositive ? "success.main" : "error.main", delay: 0.3 },
                            { title: "Current Trend", value: results.isPositive ? 'Bullish' : 'Bearish',
                              icon: results.isPositive ? <TrendingUp fontSize="small" className="trend-icon" /> : <TrendingDown fontSize="small" className="trend-icon" />,
                              color: results.isPositive ? "success.main" : "error.main", delay: 0.4
                            }
                          ].map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                              <div style={{ animation: `fadeIn 0.5s ease-out forwards`, animationDelay: `${stat.delay}s` }}>
                                <Box className="crypto-stat stat-card-animate">
                                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color={stat.color}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                    className="stat-value"
                                  >
                                    {stat.value}
                                    {stat.icon}
                                  </Typography>
                                </Box>
                              </div>
                            </Grid>
                          ))}
                        </Grid>

                        {historicalData && (
                          <Box sx={{ mt: 3, height: 250, position: 'relative' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Price History (30 Days)</Typography>
                            <PriceHistoryChart data={historicalData} isDarkMode={isDarkMode} />
                          </Box>
                        )}

                        <Box sx={{ mt: 4 }}>
                          <TweetFeed
                            cryptoName={results.name}
                            cryptoSymbol={results.symbol}
                            isDarkMode={isDarkMode}
                          />
                        </Box>
                      </Paper>
                    </div>

                    <div style={{ animation: 'fadeIn 0.5s ease-out forwards', animationDelay: '0.3s' }}>
                      {/* Replace the old prediction inputs with the new component */}
                      <PredictionInputs 
                        selectedTimeframe={selectedTimeframe}
                        setSelectedTimeframe={setSelectedTimeframe}
                        investmentAmount={investmentAmount}
                        setInvestmentAmount={setInvestmentAmount}
                        riskLevel={riskLevel}
                        setRiskLevel={setRiskLevel}
                        onCalculate={calculatePrediction}
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    {showPredictionResults && predictionData && (
                      <Box sx={{ mt: 4, animation: 'fadeIn 0.5s ease-out forwards' }}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 4, 
                            borderRadius: '24px',
                            background: isDarkMode ? 
                              'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' : 
                              'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {/* Header Section */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 4,
                            position: 'relative'
                          }}>
                            <Box>
                              <Typography variant="h5" sx={{ 
                                fontWeight: 700,
                                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <ShowChart sx={{ fontSize: 28 }} />
                                Prediction Results
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Generated on {new Date().toLocaleString()}
                              </Typography>
                            </Box>
                            <IconButton 
                              onClick={() => setShowPredictionResults(false)}
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': { 
                                  color: 'primary.main',
                                  transform: 'rotate(90deg)',
                                  transition: 'transform 0.3s ease'
                                }
                              }}
                            >
                              <Close />
                            </IconButton>
                          </Box>

                          {/* Main Prediction Cards */}
                          <Grid container spacing={3}>
                            {/* Current Price Card */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{
                                p: 3,
                                borderRadius: '16px',
                                background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                border: '1px solid',
                                borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  transition: 'transform 0.3s ease'
                                }
                              }}>
                                <Box sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  width: '150px',
                                  height: '150px',
                                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
                                  borderRadius: '50%',
                                  transform: 'translate(30%, -30%)'
                                }} />
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Current Price
                                </Typography>
                                <Typography variant="h4" sx={{ 
                                  fontWeight: 700, 
                                  mb: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  ${predictionData.currentPrice.toLocaleString()}
                                  <Box component="span" className="material-icons-outlined" sx={{ 
                                    color: 'primary.main',
                                    fontSize: 24
                                  }}>
                                    show_chart
                                  </Box>
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  mt: 2,
                                  p: 1.5,
                                  borderRadius: '8px',
                                  background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                                }}>
                                  <Box component="span" className="material-icons-outlined" sx={{ 
                                    color: 'primary.main',
                                    fontSize: 20
                                  }}>
                                    update
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Last updated price
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            {/* Predicted Price Card */}
                            <Grid item xs={12} md={6}>
                              <Box sx={{
                                p: 3,
                                borderRadius: '16px',
                                background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                                border: '1px solid',
                                borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  transition: 'transform 0.3s ease'
                                }
                              }}>
                                <Box sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  width: '150px',
                                  height: '150px',
                                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
                                  borderRadius: '50%',
                                  transform: 'translate(30%, -30%)'
                                }} />
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Predicted Price
                                </Typography>
                                <Typography variant="h4" sx={{ 
                                  fontWeight: 700, 
                                  mb: 1,
                                  color: predictionData.predictedChange > 0 ? 'success.main' : 'error.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  ${predictionData.predictedPrice.toLocaleString()}
                                  <Box component="span" className="material-icons-outlined" sx={{ 
                                    color: predictionData.predictedChange > 0 ? 'success.main' : 'error.main',
                                    fontSize: 24
                                  }}>
                                    {predictionData.predictedChange > 0 ? 'trending_up' : 'trending_down'}
                                  </Box>
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  mt: 2,
                                  p: 1.5,
                                  borderRadius: '8px',
                                  background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                                }}>
                                  <Box component="span" className="material-icons-outlined" sx={{ 
                                    color: predictionData.predictedChange > 0 ? 'success.main' : 'error.main',
                                    fontSize: 20
                                  }}>
                                    {predictionData.predictedChange > 0 ? 'arrow_upward' : 'arrow_downward'}
                                  </Box>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: predictionData.predictedChange > 0 ? 'success.main' : 'error.main',
                                      fontWeight: 500
                                    }}
                                  >
                                    {predictionData.predictedChange > 0 ? '+' : ''}{predictionData.predictedChange}% change
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            {/* Investment Analysis */}
                            <Grid item xs={12}>
                              <Box sx={{
                                p: 3,
                                borderRadius: '16px',
                                background: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
                                border: '1px solid',
                                borderColor: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
                                mt: 2
                              }}>
                                <Typography variant="h6" sx={{ 
                                  mb: 3, 
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  <Calculate sx={{ color: 'warning.main' }} />
                                  Investment Analysis
                                </Typography>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={4}>
                                    <Box sx={{ 
                                      textAlign: 'center', 
                                      p: 2,
                                      borderRadius: '12px',
                                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        transition: 'transform 0.3s ease'
                                      }
                                    }}>
                                      <Box component="span" className="material-icons-outlined" sx={{ 
                                        color: 'warning.main',
                                        fontSize: 32,
                                        mb: 1
                                      }}>
                                        account_balance_wallet
                                      </Box>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Investment Amount
                                      </Typography>
                                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        ${investmentAmount.toLocaleString()}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Initial investment
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <Box sx={{ 
                                      textAlign: 'center', 
                                      p: 2,
                                      borderRadius: '12px',
                                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        transition: 'transform 0.3s ease'
                                      }
                                    }}>
                                      <Box component="span" className="material-icons-outlined" sx={{ 
                                        color: predictionData.potentialReturn > 0 ? 'success.main' : 'error.main',
                                        fontSize: 32,
                                        mb: 1
                                      }}>
                                        {predictionData.potentialReturn > 0 ? 'trending_up' : 'trending_down'}
                                      </Box>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Potential Return
                                      </Typography>
                                      <Typography 
                                        variant="h5" 
                                        sx={{ 
                                          fontWeight: 700, 
                                          mb: 1,
                                          color: predictionData.potentialReturn > 0 ? 'success.main' : 'error.main'
                                        }}
                                      >
                                        ${Math.abs(predictionData.potentialReturn).toLocaleString()}
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          color: predictionData.potentialReturn > 0 ? 'success.main' : 'error.main'
                                        }}
                                      >
                                        {predictionData.potentialReturn > 0 ? 'Profit' : 'Loss'}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <Box sx={{ 
                                      textAlign: 'center', 
                                      p: 2,
                                      borderRadius: '12px',
                                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        transition: 'transform 0.3s ease'
                                      }
                                    }}>
                                      <Box component="span" className="material-icons-outlined" sx={{ 
                                        color: predictionData.potentialROI > 0 ? 'success.main' : 'error.main',
                                        fontSize: 32,
                                        mb: 1
                                      }}>
                                        {predictionData.potentialROI > 0 ? 'percent' : 'trending_down'}
                                      </Box>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        ROI
                                      </Typography>
                                      <Typography 
                                        variant="h5" 
                                        sx={{ 
                                          fontWeight: 700, 
                                          mb: 1,
                                          color: predictionData.potentialROI > 0 ? 'success.main' : 'error.main'
                                        }}
                                      >
                                        {predictionData.potentialROI}%
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          color: predictionData.potentialROI > 0 ? 'success.main' : 'error.main'
                                        }}
                                      >
                                        Return on Investment
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>

                            {/* Market Analysis */}
                            <Grid item xs={12}>
                              <Box sx={{
                                p: 3,
                                borderRadius: '16px',
                                background: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                                border: '1px solid',
                                borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                                mt: 2
                              }}>
                                <Typography variant="h6" sx={{ 
                                  mb: 3, 
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  <Analytics sx={{ color: 'secondary.main' }} />
                                  Market Analysis
                                </Typography>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2 }}>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Market Sentiment
                                      </Typography>
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2,
                                        mt: 1
                                      }}>
                                        <Box sx={{
                                          p: 2,
                                          borderRadius: '12px',
                                          background: predictionData.marketSentiment === 'Bullish' ? 
                                            'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                          border: '1px solid',
                                          borderColor: predictionData.marketSentiment === 'Bullish' ? 
                                            'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                          flex: 1,
                                          '&:hover': {
                                            transform: 'translateY(-2px)',
                                            transition: 'transform 0.3s ease'
                                          }
                                        }}>
                                          <Box component="span" className="material-icons-outlined" sx={{ 
                                            color: predictionData.marketSentiment === 'Bullish' ? 'success.main' : 'error.main',
                                            fontSize: 24
                                          }}>
                                            {predictionData.marketSentiment === 'Bullish' ? 'trending_up' : 'trending_down'}
                                          </Box>
                                          <Typography 
                                            variant="h6" 
                                            sx={{ 
                                              color: predictionData.marketSentiment === 'Bullish' ? 'success.main' : 'error.main',
                                              fontWeight: 600
                                            }}
                                          >
                                            {predictionData.marketSentiment}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2 }}>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Price Range
                                      </Typography>
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2,
                                        mt: 1
                                      }}>
                                        <Box sx={{
                                          p: 2,
                                          borderRadius: '12px',
                                          background: 'rgba(16, 185, 129, 0.1)',
                                          border: '1px solid',
                                          borderColor: 'rgba(16, 185, 129, 0.2)',
                                          flex: 1,
                                          '&:hover': {
                                            transform: 'translateY(-2px)',
                                            transition: 'transform 0.3s ease'
                                          }
                                        }}>
                                          <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Optimistic
                                          </Typography>
                                          <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                                            ${predictionData.optimisticPrice.toLocaleString()}
                                          </Typography>
                                        </Box>
                                        <Box sx={{
                                          p: 2,
                                          borderRadius: '12px',
                                          background: 'rgba(239, 68, 68, 0.1)',
                                          border: '1px solid',
                                          borderColor: 'rgba(239, 68, 68, 0.2)',
                                          flex: 1,
                                          '&:hover': {
                                            transform: 'translateY(-2px)',
                                            transition: 'transform 0.3s ease'
                                          }
                                        }}>
                                          <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Pessimistic
                                          </Typography>
                                          <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                                            ${predictionData.pessimisticPrice.toLocaleString()}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>

                            {/* Disclaimer */}
                            <Grid item xs={12}>
                              <Alert 
                                severity="info" 
                                sx={{ 
                                  mt: 2,
                                  borderRadius: '12px',
                                  '& .MuiAlert-icon': {
                                    color: 'primary.main'
                                  }
                                }}
                              >
                                <AlertTitle>Disclaimer</AlertTitle>
                                This prediction is based on historical data and market analysis. Cryptocurrency markets are highly volatile and predictions should not be considered as financial advice. Always do your own research before making investment decisions.
                              </Alert>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Box>
                    )}
                  </Box>
                )}

                {results && showCryptoDetails && selectedCrypto && (
                  <Box className="crypto-details-container" sx={{ mt: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px' }}>
                      <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoOutlined color="primary" />
                        Detailed Information
                      </Typography>
                      
                      {/* Key metrics in grid layout */}
                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        {selectedCrypto.market_cap && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                              <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                              <Typography variant="h6">${Number(selectedCrypto.market_cap).toLocaleString()}</Typography>
                            </Box>
                          </Grid>
                        )}
                        
                        {selectedCrypto.total_volume && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                              <Typography variant="body2" color="text.secondary">24h Volume</Typography>
                              <Typography variant="h6">${Number(selectedCrypto.total_volume).toLocaleString()}</Typography>
                            </Box>
                          </Grid>
                        )}
                        
                        {selectedCrypto.circulating_supply && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                              <Typography variant="body2" color="text.secondary">Circulating Supply</Typography>
                              <Typography variant="h6">{Number(selectedCrypto.circulating_supply).toLocaleString()}</Typography>
                            </Box>
                          </Grid>
                        )}
                        
                        {selectedCrypto.max_supply && (
                          <Grid item xs={6} sm={4} md={3}>
                            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                              <Typography variant="body2" color="text.secondary">Max Supply</Typography>
                              <Typography variant="h6">{Number(selectedCrypto.max_supply).toLocaleString()}</Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
              
                      {/* Price changes section */}
                      {(selectedCrypto.price_change_percentage_24h || 
                        selectedCrypto.price_change_percentage_7d || 
                        selectedCrypto.price_change_percentage_30d) && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>Price Changes</Typography>
                          <Grid container spacing={2}>
                            {selectedCrypto.price_change_percentage_24h !== null && (
                              <Grid item xs={12} sm={4}>
                                <Box 
                                  sx={{ 
                                    p: 2, 
                                    borderRadius: '12px', 
                                    bgcolor: 'background.paper', 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    border: '1px solid',
                                    borderColor: selectedCrypto.price_change_percentage_24h > 0 ? 'success.main' : 'error.main',
                                    borderLeft: '4px solid',
                                    borderLeftColor: selectedCrypto.price_change_percentage_24h > 0 ? 'success.main' : 'error.main',
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">24h Change</Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    {selectedCrypto.price_change_percentage_24h > 0 ? 
                                      <ArrowUpward fontSize="small" color="success" /> : 
                                      <ArrowDownward fontSize="small" color="error" />}
                                    <Typography 
                                      variant="h6" 
                                      color={selectedCrypto.price_change_percentage_24h > 0 ? 'success.main' : 'error.main'}
                                      sx={{ ml: 1 }}
                                    >
                                      {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            
                            {selectedCrypto.price_change_percentage_7d !== null && (
                              <Grid item xs={12} sm={4}>
                                <Box 
                                  sx={{ 
                                    p: 2, 
                                    borderRadius: '12px', 
                                    bgcolor: 'background.paper', 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    border: '1px solid',
                                    borderColor: selectedCrypto.price_change_percentage_7d > 0 ? 'success.main' : 'error.main',
                                    borderLeft: '4px solid',
                                    borderLeftColor: selectedCrypto.price_change_percentage_7d > 0 ? 'success.main' : 'error.main',
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">7d Change</Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    {selectedCrypto.price_change_percentage_7d > 0 ? 
                                      <ArrowUpward fontSize="small" color="success" /> : 
                                      <ArrowDownward fontSize="small" color="error" />}
                                    <Typography 
                                      variant="h6" 
                                      color={selectedCrypto.price_change_percentage_7d > 0 ? 'success.main' : 'error.main'}
                                      sx={{ ml: 1 }}
                                    >
                                      {selectedCrypto.price_change_percentage_7d.toFixed(2)}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            
                            {selectedCrypto.price_change_percentage_30d !== null && (
                              <Grid item xs={12} sm={4}>
                                <Box 
                                  sx={{ 
                                    p: 2, 
                                    borderRadius: '12px', 
                                    bgcolor: 'background.paper', 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    border: '1px solid',
                                    borderColor: selectedCrypto.price_change_percentage_30d > 0 ? 'success.main' : 'error.main',
                                    borderLeft: '4px solid',
                                    borderLeftColor: selectedCrypto.price_change_percentage_30d > 0 ? 'success.main' : 'error.main',
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">30d Change</Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    {selectedCrypto.price_change_percentage_30d > 0 ? 
                                      <ArrowUpward fontSize="small" color="success" /> : 
                                      <ArrowDownward fontSize="small" color="error" />}
                                    <Typography 
                                      variant="h6" 
                                      color={selectedCrypto.price_change_percentage_30d > 0 ? 'success.main' : 'error.main'}
                                      sx={{ ml: 1 }}
                                    >
                                      {selectedCrypto.price_change_percentage_30d.toFixed(2)}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      )}
                      
                      {/* All-time highs and lows */}
                      {(selectedCrypto.ath || selectedCrypto.atl) && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StarBorder color="primary" />
                            All-time Stats
                          </Typography>
                          <Grid container spacing={3}>
                            {selectedCrypto.ath && (
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                  <Typography variant="body2" color="text.secondary">All-time High</Typography>
                                  <Typography variant="h6">${Number(selectedCrypto.ath).toLocaleString()}</Typography>
                                  {selectedCrypto.ath_date && (
                                    <Typography variant="caption" color="text.secondary">
                                      on {new Date(selectedCrypto.ath_date).toLocaleDateString()}
                                    </Typography>
                                  )}
                                  {selectedCrypto.ath_change_percentage && (
                                    <Chip 
                                      size="small" 
                                      label={`${selectedCrypto.ath_change_percentage.toFixed(2)}% from ATH`}
                                      color={selectedCrypto.ath_change_percentage > -10 ? "success" : "default"}
                                      sx={{ mt: 1 }}
                                    />
                                  )}
                                </Box>
                              </Grid>
                            )}
                            
                            {selectedCrypto.atl && (
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                  <Typography variant="body2" color="text.secondary">All-time Low</Typography>
                                  <Typography variant="h6">${Number(selectedCrypto.atl).toLocaleString()}</Typography>
                                  {selectedCrypto.atl_date && (
                                    <Typography variant="caption" color="text.secondary">
                                      on {new Date(selectedCrypto.atl_date).toLocaleDateString()}
                                    </Typography>
                                  )}
                                  {selectedCrypto.atl_change_percentage && (
                                    <Chip 
                                      size="small" 
                                      label={`+${Math.abs(selectedCrypto.atl_change_percentage).toFixed(2)}% from ATL`}
                                      color="success"
                                      sx={{ mt: 1 }}
                                    />
                                  )}
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      )}
              
                      {/* About section with description */}
                      {selectedCrypto.description && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoOutlined fontSize="small" />
                            About {selectedCrypto.name}
                          </Typography>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 3, 
                              borderRadius: '12px',
                              maxHeight: '300px',
                              overflow: 'auto'
                            }}
                          >
                            <div dangerouslySetInnerHTML={{ __html: selectedCrypto.description }} />
                          </Paper>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                )}
              </Container>
            </Box>
          } />
        </Routes>

        {/* Notifications Menu */}
        <Menu
          id="notifications-menu"
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 320,
              borderRadius: 2,
              boxShadow: 4
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* ...notification menu items... */}
        </Menu>

        {/* User Profile Menu */}
        <Menu
          id="user-menu"
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: 4
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 50, 
                height: 50, 
                bgcolor: 'primary.main',
                mb: 1
              }}
            >
              <Person sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>User Account</Typography>
            <Typography variant="caption" color="text.secondary">user@example.com</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Person fontSize="small" />
              <Typography>Profile</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Settings fontSize="small" />
              <Typography>Settings</Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Logout fontSize="small" />
              <Typography>Logout</Typography>
            </Box>
          </MenuItem>
        </Menu>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} CryptoPredict. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;

