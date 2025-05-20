import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, FormControl, Select, MenuItem, Grid } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const MarketHeatmap = ({ isDarkMode }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [marketData, setMarketData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Memoize the function to prevent infinite re-renders
  const generateMockMarketData = useCallback(() => {
    const categories = [
      { name: 'Layer 1', tokens: ['BTC', 'ETH', 'SOL', 'ADA', 'AVAX', 'DOT', 'ATOM', 'NEAR', 'FTM'] },
      { name: 'Layer 2', tokens: ['MATIC', 'OP', 'ARB', 'IMX', 'METIS', 'BOBA', 'ZKS'] },
      { name: 'DeFi', tokens: ['UNI', 'AAVE', 'CRV', 'MKR', 'SNX', 'COMP', 'SUSHI', 'YFI', 'BAL', 'LDO'] },
      { name: 'Exchange', tokens: ['BNB', 'CRO', 'FTT', 'KCS', 'OKB', 'GT', 'HT'] },
      { name: 'Meme', tokens: ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF'] }
    ];
    
    // Different volatility ranges based on time range
    let volatilityRange;
    switch(timeRange) {
      case '1h':
        volatilityRange = 5;
        break;
      case '24h':
        volatilityRange = 15;
        break;
      case '7d':
        volatilityRange = 30;
        break;
      case '30d':
        volatilityRange = 60;
        break;
      default:
        volatilityRange = 15;
    }
    
    const mockData = categories.map(category => {
      return {
        name: category.name,
        tokens: category.tokens.map(symbol => {
          // More positive changes for longer timeframes
          const positiveChanceBias = timeRange === '30d' ? 0.65 : 
                                    timeRange === '7d' ? 0.55 : 0.5;
          
          const isPositive = Math.random() < positiveChanceBias;
          const changeValue = (Math.random() * volatilityRange * (isPositive ? 1 : -1)).toFixed(2);
          
          // Set market cap - higher for popular coins
          let marketCap;
          if (symbol === 'BTC' || symbol === 'ETH') {
            marketCap = Math.floor(100 + Math.random() * 900);
          } else if (['SOL', 'BNB', 'ADA', 'MATIC'].includes(symbol)) {
            marketCap = Math.floor(10 + Math.random() * 90);
          } else {
            marketCap = Math.floor(0.5 + Math.random() * 9.5);
          }
          
          return {
            symbol,
            name: getFullName(symbol),
            change: changeValue,
            isPositive: parseFloat(changeValue) >= 0,
            marketCap: marketCap
          };
        })
      };
    });
    
    return mockData;
  }, [timeRange]); // Dependency array includes timeRange since it affects the function's behavior

  useEffect(() => {
    const data = generateMockMarketData();
    setMarketData(data);
    
    const timer = setTimeout(() => {
      setDataLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [generateMockMarketData]); // Include the dependency here

  const getFullName = (symbol) => {
    const names = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'SOL': 'Solana',
      'ADA': 'Cardano',
      'AVAX': 'Avalanche',
      'DOT': 'Polkadot',
      'ATOM': 'Cosmos',
      'NEAR': 'Near Protocol',
      'FTM': 'Fantom',
      'MATIC': 'Polygon',
      'OP': 'Optimism',
      'ARB': 'Arbitrum',
      'IMX': 'Immutable X',
      'METIS': 'Metis',
      'BOBA': 'Boba Network',
      'ZKS': 'ZKSync',
      'UNI': 'Uniswap',
      'AAVE': 'Aave',
      'CRV': 'Curve',
      'MKR': 'Maker',
      'SNX': 'Synthetix',
      'COMP': 'Compound',
      'SUSHI': 'SushiSwap',
      'YFI': 'Yearn Finance',
      'BAL': 'Balancer',
      'LDO': 'Lido',
      'BNB': 'Binance Coin',
      'CRO': 'Cronos',
      'FTT': 'FTX Token',
      'KCS': 'KuCoin Token',
      'OKB': 'OKB',
      'GT': 'Gate Token',
      'HT': 'Huobi Token',
      'DOGE': 'Dogecoin',
      'SHIB': 'Shiba Inu',
      'PEPE': 'Pepe Coin',
      'FLOKI': 'Floki Inu',
      'BONK': 'Bonk',
      'WIF': 'Wif Coin'
    };
    
    return names[symbol] || symbol;
  };
  
  const getColorIntensity = (change) => {
    const absChange = Math.abs(parseFloat(change));
    let intensity;
    
    if (absChange > 20) intensity = 100;
    else if (absChange > 15) intensity = 90;
    else if (absChange > 10) intensity = 80;
    else if (absChange > 7) intensity = 70;
    else if (absChange > 5) intensity = 60;
    else if (absChange > 3) intensity = 50;
    else if (absChange > 2) intensity = 40;
    else if (absChange > 1) intensity = 30;
    else if (absChange > 0.5) intensity = 20;
    else intensity = 10;
    
    return intensity;
  };
  
  const getBoxSize = (marketCap) => {
    if (marketCap > 500) return { xs: 12, sm: 6, md: 4 }; // BTC, ETH
    if (marketCap > 50) return { xs: 6, sm: 4, md: 3 }; // Large caps
    if (marketCap > 10) return { xs: 6, sm: 3, md: 2 }; // Mid caps
    return { xs: 4, sm: 2, md: 1 }; // Small caps
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{
        p: 3, 
        borderRadius: '16px',
        background: isDarkMode ? 
          'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)' : 
          'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="heatmap-container"
    >
      <Box 
        sx={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography 
          variant="h6" 
          sx={{
            display: 'flex',
            alignItems: 'center', 
            gap: 1,
            position: 'relative'
          }}
        >
          <Box component="span" className="material-icons-outlined">
            grid_view
          </Box>
          Market Heatmap
          <Box 
            className="header-underline animated-underline" 
            sx={{
              position: 'absolute', 
              bottom: -5, 
              left: 0, 
              height: 2, 
              width: '40px', 
              bgcolor: 'primary.main', 
              borderRadius: '2px' 
            }} 
          />
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            displayEmpty
            variant="outlined"
            sx={{ borderRadius: '10px' }}
          >
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="24h">24 Hours</MenuItem>
            <MenuItem value="7d">7 Days</MenuItem>
            <MenuItem value="30d">30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box 
        sx={{ 
          overflowX: 'auto', 
          mt: 2 
        }}
      >
        {marketData.map((category, index) => (
          <Box 
            key={category.name} 
            sx={{
              mb: 4,
              animation: 'fadeIn 0.5s forwards',
              animationDelay: `${index * 0.1}s`,
              opacity: 0
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{
                mb: 2,
                fontWeight: 600,
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
              }}
            >
              {category.name}
            </Typography>
            
            <Grid container spacing={1}>
              {category.tokens.map((token) => {
                const intensity = getColorIntensity(token.change);
                const boxSize = getBoxSize(token.marketCap);
                
                return (
                  <Grid 
                    item 
                    key={token.symbol} 
                    {...boxSize}
                  >
                    <Box 
                      sx={{
                        p: 1.5, 
                        borderRadius: '12px',
                        bgcolor: token.isPositive 
                          ? `rgba(16, 185, 129, 0.${intensity})` 
                          : `rgba(239, 68, 68, 0.${intensity})`,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: token.isPositive 
                            ? `0 10px 15px -3px rgba(16, 185, 129, 0.2)` 
                            : `0 10px 15px -3px rgba(239, 68, 68, 0.2)`
                        }
                      }}
                    >
                      <Box 
                        className="shimmer-bg"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.1,
                          zIndex: 0
                        }}
                      />
                      
                      <Typography 
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          zIndex: 1
                        }}
                      >
                        {token.symbol}
                        <Box 
                          sx={{
                            bgcolor: token.isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                            borderRadius: '4px',
                            px: 0.75,
                            py: 0.25,
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.75rem'
                          }}
                        >
                          {token.isPositive ? 
                            <TrendingUp fontSize="inherit" sx={{ mr: 0.5 }} /> : 
                            <TrendingDown fontSize="inherit" sx={{ mr: 0.5 }} />
                          }
                          {token.change}%
                        </Box>
                      </Typography>
                      
                      <Typography 
                        variant="caption" 
                        sx={{
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                          fontWeight: 400,
                          zIndex: 1
                        }}
                      >
                        {token.name}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default MarketHeatmap;
