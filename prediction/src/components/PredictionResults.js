import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Alert,
  AlertTitle,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Zoom,
  Fade,
  Card,
  CardContent,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  Info,
  Close,
  Calculate,
  Analytics,
  AccountBalanceWallet,
  Percent,
  Update,
  ArrowUpward,
  ArrowDownward,
  ShowChart,
  Speed,
  Warning
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PriceChangeChart from './PriceChangeChart';
import AnimatedNumber from './AnimatedNumber';

const PredictionResults = ({ 
  predictionData, 
  onClose, 
  isDarkMode,
  investmentAmount,
  timeframe
}) => {
  const [animatedResults, setAnimatedResults] = useState(false);
  const [chartAnimationComplete, setChartAnimationComplete] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setAnimatedResults(true);
  }, []);

  if (!predictionData) return null;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
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
          backdropFilter: 'blur(5px)'
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              width: { xs: '95%', md: '90%' },
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '24px',
              p: 4,
              position: 'relative',
              background: isDarkMode ? 
                'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' : 
                'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
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

            {/* Header Section */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Timeline sx={{ color: 'primary.main', fontSize: 28 }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    AI Price Prediction Results
                  </Typography>
                  <Chip
                    label={`${formatTimeframe(timeframe)} Forecast`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  />
                </Box>
                <Divider />
              </Box>
            </motion.div>

            {/* Main Prediction Visualization */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <PriceChangeChart
                  startPrice={predictionData.currentPrice}
                  endPrice={predictionData.predictedPrice}
                  isDarkMode={isDarkMode}
                  timeframe={timeframe}
                  onAnimationComplete={handleChartAnimationComplete}
                  animated={animatedResults}
                />
              </Box>
            </motion.div>

            {/* Price Comparison Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: '16px',
                      background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
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
                        ${predictionData.currentPrice?.toLocaleString()}
                        <ShowChart sx={{ color: 'primary.main' }} />
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
                        <Update sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Last updated price
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: '16px',
                      background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
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
                        color: predictionData.predictedChange >= 0 ? 'success.main' : 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        ${predictionData.predictedPrice?.toLocaleString()}
                        {predictionData.predictedChange >= 0 ? 
                          <TrendingUp sx={{ color: 'success.main' }} /> : 
                          <TrendingDown sx={{ color: 'error.main' }} />
                        }
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
                        {predictionData.predictedChange >= 0 ? 
                          <ArrowUpward sx={{ color: 'success.main', fontSize: 20 }} /> : 
                          <ArrowDownward sx={{ color: 'error.main', fontSize: 20 }} />
                        }
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: predictionData.predictedChange >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 500
                          }}
                        >
                          {predictionData.predictedChange >= 0 ? '+' : ''}{predictionData.predictedChange}% change
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            {/* Investment Analysis */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
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
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <AccountBalanceWallet sx={{ 
                          color: 'warning.main',
                          fontSize: 32,
                          mb: 1
                        }} />
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Investment Amount
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                          ${investmentAmount?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Initial investment
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        {predictionData.potentialReturn >= 0 ? 
                          <TrendingUp sx={{ 
                            color: 'success.main',
                            fontSize: 32,
                            mb: 1
                          }} /> : 
                          <TrendingDown sx={{ 
                            color: 'error.main',
                            fontSize: 32,
                            mb: 1
                          }} />
                        }
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Potential Return
                        </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 1,
                            color: predictionData.potentialReturn >= 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          ${Math.abs(predictionData.potentialReturn)?.toLocaleString()}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: predictionData.potentialReturn >= 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          {predictionData.potentialReturn >= 0 ? 'Profit' : 'Loss'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Percent sx={{ 
                          color: predictionData.potentialROI >= 0 ? 'success.main' : 'error.main',
                          fontSize: 32,
                          mb: 1
                        }} />
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          ROI
                        </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 1,
                            color: predictionData.potentialROI >= 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          {predictionData.potentialROI}%
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: predictionData.potentialROI >= 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          Return on Investment
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>

            {/* Market Analysis */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
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
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Market Sentiment
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          mt: 1
                        }}>
                          <Paper
                            elevation={0}
                            sx={{
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
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            {predictionData.marketSentiment === 'Bullish' ? 
                              <TrendingUp sx={{ 
                                color: 'success.main',
                                fontSize: 24
                              }} /> : 
                              <TrendingDown sx={{ 
                                color: 'error.main',
                                fontSize: 24
                              }} />
                            }
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: predictionData.marketSentiment === 'Bullish' ? 'success.main' : 'error.main',
                                fontWeight: 600
                              }}
                            >
                              {predictionData.marketSentiment}
                            </Typography>
                          </Paper>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Price Range
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          mt: 1
                        }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid',
                              borderColor: 'rgba(16, 185, 129, 0.2)',
                              flex: 1,
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Optimistic
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                              ${predictionData.optimisticPrice?.toLocaleString()}
                            </Typography>
                          </Paper>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid',
                              borderColor: 'rgba(239, 68, 68, 0.2)',
                              flex: 1,
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Pessimistic
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                              ${predictionData.pessimisticPrice?.toLocaleString()}
                            </Typography>
                          </Paper>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>

            {/* Disclaimer */}
            <motion.div variants={itemVariants}>
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
            </motion.div>
          </Paper>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default PredictionResults; 