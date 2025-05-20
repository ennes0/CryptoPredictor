import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Collapse,
  Divider,
  IconButton
} from '@mui/material';
import { TrendingUp, TrendingDown, CompareArrows, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const coinData = [
  { 
    id: 'bitcoin', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    price: 43520.65, 
    change: '+2.3%', 
    isPositive: true, 
    marketCap: '825.4B',
    volume: '32.1B',
    sparkline: 'M0,10 L10,8 L20,12 L30,7 L40,9 L50,5 L60,8 L70,6 L80,10 L90,7 L100,9'
  },
  { 
    id: 'ethereum', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    price: 3275.12, 
    change: '+1.8%', 
    isPositive: true, 
    marketCap: '386.2B',
    volume: '14.8B',
    sparkline: 'M0,10 L10,7 L20,9 L30,8 L40,6 L50,10 L60,9 L70,7 L80,8 L90,6 L100,7'
  },
  { 
    id: 'cardano', 
    name: 'Cardano', 
    symbol: 'ADA', 
    price: 1.12, 
    change: '-0.5%', 
    isPositive: false, 
    marketCap: '36.8B',
    volume: '1.2B',
    sparkline: 'M0,8 L10,9 L20,7 L30,10 L40,8 L50,9 L60,6 L70,8 L80,7 L90,9 L100,8'
  },
  { 
    id: 'solana', 
    name: 'Solana', 
    symbol: 'SOL', 
    price: 102.48, 
    change: '+4.2%', 
    isPositive: true, 
    marketCap: '42.3B',
    volume: '2.8B',
    sparkline: 'M0,9 L10,7 L20,8 L30,6 L40,7 L50,5 L60,3 L70,6 L80,4 L90,5 L100,4'
  },
  { 
    id: 'ripple', 
    name: 'Ripple', 
    symbol: 'XRP', 
    price: 0.78, 
    change: '-1.2%', 
    isPositive: false, 
    marketCap: '38.5B',
    volume: '1.9B',
    sparkline: 'M0,7 L10,8 L20,9 L30,7 L40,8 L50,10 L60,9 L70,10 L80,8 L90,9 L100,8'
  },
  { 
    id: 'polkadot', 
    name: 'Polkadot', 
    symbol: 'DOT', 
    price: 18.35, 
    change: '+0.8%', 
    isPositive: true, 
    marketCap: '21.6B',
    volume: '1.1B',
    sparkline: 'M0,8 L10,9 L20,7 L30,8 L40,6 L50,7 L60,9 L70,8 L80,9 L90,7 L100,8'
  }
];

const PriceComparison = ({ isDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // Find max price for scaling
  const maxPrice = Math.max(...coinData.map(coin => coin.price));
  
  // Sort coins by price (highest to lowest)
  const sortedCoins = [...coinData].sort((a, b) => b.price - a.price);
  
  // Display top 4 coins when collapsed
  const displayCoins = expanded ? sortedCoins : sortedCoins.slice(0, 4);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getBarWidth = (price) => {
    return (price / maxPrice) * 100;
  };
  
  return (
    <Box sx={{ mb: 4, animation: 'fadeIn 0.7s ease-out forwards' }}>
      {/* Collapsible Toggle Header */}
      <Paper 
        elevation={0} 
        onClick={() => setShowComparison(prev => !prev)}
        sx={{ 
          p: 2,
          borderRadius: '16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          background: isDarkMode ? 
            'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.15) 100%)' : 
            'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
          '&:hover': {
            background: isDarkMode ? 
              'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.2) 100%)' : 
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.15) 100%)',
          }
        }}
        className="price-toggle"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrows color="primary" />
          <Typography variant="subtitle1" fontWeight="medium">
            Cryptocurrency Price Comparison
          </Typography>
          <Box 
            component="span" 
            sx={{ 
              fontSize: '0.75rem', 
              bgcolor: 'primary.main', 
              color: 'white',
              px: 1,
              py: 0.25,
              borderRadius: '10px',
              ml: 1
            }}
          >
            LIVE
          </Box>
        </Box>
        
        <IconButton
          size="small"
          sx={{ 
            transition: 'transform 0.3s ease',
            transform: showComparison ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
      </Paper>

      {/* Collapsible Content */}
      <Collapse in={showComparison} timeout={500}>
        <Box sx={{ mt: 2, animation: showComparison ? 'fadeIn 0.5s ease-out forwards' : 'none' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: '16px',
              overflow: 'hidden',
              p: 3,
              position: 'relative',
              bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'white',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.06)',
              boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}
            className="price-comparison-wrapper"
          >
            <Box 
              className="price-comparison-header"
              sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompareArrows color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Live Market Prices
                </Typography>
              </Box>
              
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                endIcon={expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                sx={{ 
                  textTransform: 'none',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
                }}
                className="comparison-toggle-button"
              >
                {expanded ? 'Show Less' : 'Show All'}
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3, opacity: isDarkMode ? 0.2 : 0.6 }} />
            
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item xs={6} md={3}>
                  <Typography 
                    variant="caption" 
                    className="column-header"
                    sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
                  >
                    <Box component="span" className="material-icons-outlined" sx={{ fontSize: 14 }}>
                      currency_bitcoin
                    </Box>
                    Cryptocurrency
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography 
                    variant="caption" 
                    className="column-header" 
                    sx={{ 
                      justifyContent: 'flex-end',
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    <Box component="span" className="material-icons-outlined" sx={{ fontSize: 14 }}>
                      attach_money
                    </Box>
                    Current Price
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography 
                    variant="caption" 
                    className="column-header"
                    sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
                  >
                    <Box component="span" className="material-icons-outlined" sx={{ fontSize: 14 }}>
                      show_chart
                    </Box>
                    24h Change
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography 
                    variant="caption" 
                    className="column-header"
                    sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
                  >
                    <Box component="span" className="material-icons-outlined" sx={{ fontSize: 14 }}>
                      leaderboard
                    </Box>
                    Price Comparison
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Collapse in={true} timeout={1000}>
              <Box>
                {displayCoins.map((coin, index) => (
                  <Paper
                    key={coin.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'white',
                      opacity: 0,
                      transform: 'translateY(20px)',
                      animation: 'slideUp 0.5s forwards',
                      animationDelay: `${0.1 + index * 0.1}s`
                    }}
                    className="compare-coin-card"
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6} md={3} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          className="coin-logo-wrapper" 
                          sx={{ 
                            bgcolor: isDarkMode ?
                              `rgba(${coin.isPositive ? '16, 185, 129' : '239, 68, 68'}, 0.2)` :
                              `rgba(${coin.isPositive ? '16, 185, 129' : '239, 68, 68'}, 0.1)`
                          }}
                        >
                          <Avatar
                            src={`https://cryptologos.cc/logos/${coin.id}-${coin.symbol.toLowerCase()}-logo.png?v=023`}
                            alt={coin.name}
                            sx={{ width: 28, height: 28 }}
                          />
                        </Box>
                        <Box className="coin-details">
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600, 
                              lineHeight: 1.2,
                              color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'inherit'
                            }}
                          >
                            {coin.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}
                          >
                            {coin.symbol}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3} sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 700,
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'inherit'
                          }}
                        >
                          ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}
                        >
                          Vol: ${coin.volume}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Chip
                          label={coin.change}
                          size="small"
                          icon={coin.isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                          sx={{
                            bgcolor: coin.isPositive ? 
                              (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)') : 
                              (isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'),
                            color: coin.isPositive ? '#10b981' : '#ef4444',
                            border: '1px solid',
                            borderColor: coin.isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            '--delay': index + 1
                          }}
                          className="coin-change-chip"
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            mt: 0.5, 
                            fontSize: '0.7rem',
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                          }}
                        >
                          Market Cap: ${coin.marketCap}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box 
                          className="coin-price-bar"
                          sx={{ 
                            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <Box 
                            className={`coin-price-progress ${coin.symbol.toLowerCase()}-bar`}
                            sx={{ 
                              width: `${getBarWidth(coin.price)}%`,
                              opacity: 0,
                              animation: 'fadeIn 0.5s forwards',
                              animationDelay: `${0.5 + index * 0.1}s`
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            mt: 0.5, 
                            textAlign: 'right', 
                            fontSize: '0.7rem',
                            opacity: 0,
                            animation: 'fadeIn 0.5s forwards',
                            animationDelay: `${0.7 + index * 0.1}s`,
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                          }}
                        >
                          {getBarWidth(coin.price).toFixed(1)}% of BTC
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <svg className="coin-sparkline" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path
                        d={coin.sparkline}
                        fill="none"
                        stroke={coin.isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth="1"
                        className="animate-sparkline"
                      />
                    </svg>
                    
                    <Box 
                      className="compare-card-pattern" 
                      sx={{ color: coin.isPositive ? '#10b981' : '#ef4444' }}
                    />
                  </Paper>
                ))}
              </Box>
            </Collapse>
            
            {animationComplete && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Box component="span" className="material-icons-outlined">insights</Box>}
                  sx={{ 
                    borderRadius: '10px', 
                    textTransform: 'none',
                    borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.5)' : undefined,
                    color: isDarkMode ? 'rgba(59, 130, 246, 0.9)' : undefined,
                    '&:hover': {
                      borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : undefined,
                      background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : undefined
                    }
                  }}
                  className="compare-all-button"
                >
                  Advanced Comparison & Analysis
                </Button>
              </Box>
            )}
            
            <Box 
              className="market-cap-indicator"
              sx={{
                '& .MuiTypography-caption': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                }
              }}
            >
              <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                Market Dominance:
              </Typography>
              <Box 
                className="market-cap-bar"
                sx={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
                }}
              >
                <Box className="market-cap-progress" sx={{ width: '73%' }} />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600, 
                  color: isDarkMode ? 'rgba(59, 130, 246, 0.9)' : 'primary.main' 
                }}
              >
                BTC 73%
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Collapse>
    </Box>
  );
};

export default PriceComparison;
