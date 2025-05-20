import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Slider,
  InputAdornment,
  FormHelperText,
  useTheme,
  Fade
} from '@mui/material';
import {
  Calculate,
  ViewWeek,
  AccountBalanceWallet,
  Balance,
  Info,
  ShowChart,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';

const PredictionInputs = ({ 
  selectedTimeframe, 
  setSelectedTimeframe, 
  investmentAmount, 
  setInvestmentAmount, 
  riskLevel, 
  setRiskLevel,
  onCalculate,
  isDarkMode 
}) => {
  const theme = useTheme();
  const [animationStage, setAnimationStage] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState(selectedTimeframe);
  const [hoverItem, setHoverItem] = useState(null);

  useEffect(() => {
    // Sequential animation for inputs
    const timer = setTimeout(() => {
      setAnimationStage(3);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeframeChange = (event) => {
    setActiveTimeframe(event.target.value);
    setSelectedTimeframe(event.target.value);
  };

  const handleCalculateClick = () => {
    setCalculating(true);
    setRippleEffect(true);
    
    // Wait for animation before actually calculating
    setTimeout(() => {
      onCalculate();
      setCalculating(false);
      setRippleEffect(false);
    }, 1200);
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

  const getTimeframeDescription = (tf) => {
    switch (tf) {
      case '1d': return 'Daily price movement';
      case '7d': return 'Weekly market forecast';
      case '30d': return 'Monthly trend analysis';
      case '90d': return 'Quarterly outlook';
      case '1y': return 'Yearly performance projection';
      default: return '';
    }
  };

  const getRiskDescription = (level) => {
    switch (level) {
      case 1:
        return 'Conservative approach prioritizing safety over high returns';
      case 2:
        return 'Balanced approach with moderate potential returns and risk';
      case 3:
        return 'Aggressive strategy seeking maximum gains with higher volatility';
      default:
        return '';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return '';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: '24px',
        p: 3,
        background: isDarkMode 
          ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.9))' 
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 245, 255, 0.8))',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
        boxShadow: isDarkMode
          ? '0 10px 25px rgba(0, 0, 0, 0.3)'
          : '0 10px 25px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: isDarkMode
            ? '0 14px 30px rgba(0, 0, 0, 0.4)'
            : '0 14px 30px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-3px)'
        }
      }}
    >
      {/* Decorative elements */}
      <Box 
        className="decorative-circle"
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
          top: '-80px',
          right: '-80px',
          zIndex: 0,
          opacity: 0.8
        }}
      />
      <Box 
        className="decorative-circle"
        sx={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
          bottom: '-60px',
          left: '-60px',
          zIndex: 0,
          opacity: 0.8
        }}
      />

      {/* Card header */}
      <Box 
        className="card-header-section"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 3
        }}
      >
        <Typography 
          variant="h6" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            fontWeight: 600,
            position: 'relative',
            color: isDarkMode ? '#fff' : '#1e293b'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 0.5
            }}
          >
            <Calculate 
              className="card-icon-pulse" 
              sx={{
                color: theme.palette.primary.main,
                fontSize: 28,
                animation: 'pulse 2s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.1)' },
                  '100%': { opacity: 0.6, transform: 'scale(1)' }
                }
              }}
            />
            <span>Customize Your Prediction</span>
          </Box>
          <Box 
            className="header-underline animated-underline"
            sx={{
              width: '40px',
              height: '3px',
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '2px',
              transition: 'width 0.5s ease',
              animation: 'expandWidth 1.2s ease-out forwards',
              '@keyframes expandWidth': {
                '0%': { width: '20px' },
                '100%': { width: '80px' }
              }
            }}
          />
        </Typography>
      </Box>

      {/* Inputs grid */}
      <Grid 
        container 
        direction="row" 
        spacing={4}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        {/* Timeframe selection */}
        <Grid item xs={12} md={4}>
          <Fade in={animationStage >= 1} timeout={600} style={{ transitionDelay: '400ms' }}>
            <div>
              <FormControl fullWidth className="enhanced-select-container">
                <InputLabel 
                  shrink
                  sx={{ 
                    color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                    fontWeight: 500
                  }}
                >
                  Timeframe
                </InputLabel>
                <Select
                  value={selectedTimeframe}
                  onChange={handleTimeframeChange}
                  className={`select-animate ${activeTimeframe === selectedTimeframe ? 'active-timeframe' : ''}`}
                  sx={{
                    height: 65,
                    mt: 1,
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    background: isDarkMode 
                      ? 'rgba(30, 41, 59, 0.7)' 
                      : 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isDarkMode 
                        ? 'rgba(30, 41, 59, 0.9)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    },
                    '& .MuiSelect-select': {
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      py: 0
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        mt: 1,
                        background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                      }
                    }
                  }}
                >
                  {['1d', '7d', '30d', '90d', '1y'].map((tf) => (
                    <MenuItem 
                      key={tf} 
                      value={tf}
                      sx={{
                        py: 1.5,
                        borderRadius: '8px',
                        my: 0.5,
                        mx: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: isDarkMode 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'rgba(59, 130, 246, 0.05)',
                        },
                        '&.Mui-selected': {
                          background: isDarkMode 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : 'rgba(59, 130, 246, 0.1)',
                          '&:hover': {
                            background: isDarkMode 
                              ? 'rgba(59, 130, 246, 0.25)' 
                              : 'rgba(59, 130, 246, 0.15)',
                          }
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ViewWeek sx={{ 
                          color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                          fontSize: 20
                        }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatTimeframe(tf)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getTimeframeDescription(tf)}
                          </Typography>
                        </Box>
                        {selectedTimeframe === tf && (
                          <CheckCircle sx={{ 
                            ml: 'auto', 
                            color: theme.palette.primary.main,
                            fontSize: 18 
                          }} />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <Typography 
                  variant="caption" 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 1,
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    gap: 0.5
                  }}
                >
                  ⚖️ Balanced accuracy for weekly predictions
                </Typography>
              </FormControl>
            </div>
          </Fade>
        </Grid>

        {/* Investment amount input */}
        <Grid item xs={12} md={4}>
          <Fade in={animationStage >= 2} timeout={600} style={{ transitionDelay: '500ms' }}>
            <div>
              <TextField
                label="Investment Amount ($)"
                fullWidth
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="input-animate"
                helperText={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 0.75,
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                  }}>
                    <AccountBalanceWallet sx={{ fontSize: 16 }} />
                    <span>Moderate investment with balanced risk-reward</span>
                  </Box>
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.primary.main,
                          fontSize: '1.1rem'
                        }}
                      >
                        $
                      </Box>
                    </InputAdornment>
                  ),
                  className: 'investment-input',
                  sx: {
                    height: 65,
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    background: isDarkMode 
                      ? 'rgba(30, 41, 59, 0.7)' 
                      : 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isDarkMode 
                        ? 'rgba(30, 41, 59, 0.9)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    },
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { 
                    color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                    fontWeight: 500
                  }
                }}
              />
              <Box 
                sx={{
                  position: 'relative',
                  height: 4,
                  mt: -0.5,
                  mx: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  opacity: 0.7
                }}
              >
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${Math.min(Math.max(investmentAmount / 5000 * 100, 5), 100)}%`,
                    bottom: 0,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transition: 'width 0.5s ease-out',
                    borderRadius: 2
                  }}
                />
              </Box>
            </div>
          </Fade>
        </Grid>

        {/* Risk level slider */}
        <Grid item xs={12} md={4}>
          <Fade in={animationStage >= 3} timeout={600} style={{ transitionDelay: '600ms' }}>
            <div>
              <Box className="risk-slider-container" sx={{ mt: 1 }}>
                <Typography 
                  variant="body1" 
                  gutterBottom 
                  className="slider-label"
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    fontWeight: 500,
                    color: isDarkMode ? '#fff' : '#1e293b'
                  }}
                >
                  <span>Risk Level:</span>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      color: riskLevel === 1 
                        ? '#10b981' 
                        : riskLevel === 2 
                        ? '#f59e0b' 
                        : '#ef4444',
                      fontWeight: 600,
                      transition: 'color 0.3s ease'
                    }}
                  >
                    <Balance sx={{ fontSize: 18 }} />
                    {getRiskLabel(riskLevel)}
                  </Box>
                </Typography>
                
                <Slider
                  value={riskLevel}
                  onChange={(e, newValue) => setRiskLevel(newValue)}
                  step={1}
                  marks={[
                    { value: 1, label: 'Low' },
                    { value: 2, label: 'Med' },
                    { value: 3, label: 'High' }
                  ]}
                  min={1}
                  max={3}
                  className={`risk-slider risk-level-${riskLevel}`}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiSlider-rail': {
                      height: 8,
                      opacity: 0.4,
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    },
                    '& .MuiSlider-track': {
                      height: 8,
                      background: riskLevel === 1 
                        ? 'linear-gradient(to right, #10b981, #0ea5e9)'
                        : riskLevel === 2 
                        ? 'linear-gradient(to right, #f59e0b, #f97316)'
                        : 'linear-gradient(to right, #ef4444, #f97316)',
                      border: 'none',
                      transition: 'background 0.5s ease'
                    },
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                      background: '#fff',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      '&:before': {
                        display: 'none'
                      },
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
                      },
                      '&.Mui-active': {
                        boxShadow: '0 3px 15px rgba(0,0,0,0.3)'
                      }
                    },
                    '& .MuiSlider-markLabel': {
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    },
                    '& .MuiSlider-markLabelActive': {
                      color: riskLevel === 1 
                        ? '#10b981' 
                        : riskLevel === 2 
                          ? '#f59e0b' 
                          : '#ef4444'
                    }
                  }}
                />
                
                <Box 
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: 1.5,
                    borderRadius: '10px',
                    background: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    animation: 'fadeIn 0.5s ease-out forwards',
                  }}
                >
                  <Box 
                    sx={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: riskLevel === 1 
                        ? '#10b981' 
                        : riskLevel === 2 
                          ? '#f59e0b' 
                          : '#ef4444',
                      transition: 'background 0.3s ease'
                    }}
                  />
                  <Info sx={{ 
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    fontSize: 18
                  }} />
                  <span>{getRiskDescription(riskLevel)}</span>
                </Box>
              </Box>
            </div>
          </Fade>
        </Grid>
      </Grid>

      {/* Calculate button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: 5,
        position: 'relative',
        zIndex: 1
      }}>
        <Fade in={animationStage >= 3} timeout={800} style={{ transitionDelay: '700ms', position: 'relative' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="calculate-button"
            onClick={handleCalculateClick}
            disabled={calculating}
            sx={{
              position: 'relative',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              '&:hover': {
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)'
              },
              '&:active': {
                transform: 'translateY(1px)'
              }
            }}
            startIcon={
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24
                }}
              >
                <ShowChart className="button-icon-animate" sx={{ 
                  fontSize: 22,
                  animation: calculating ? 'rotateIcon 1.2s infinite linear' : 'none',
                  '@keyframes rotateIcon': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </Box>
            }
            endIcon={
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24
                }}
              >
                <ArrowForward className="button-icon-animate" sx={{ 
                  fontSize: 22,
                  animation: calculating ? 'pulseArrow 1.2s infinite ease-in-out' : 'none',
                  '@keyframes pulseArrow': {
                    '0%': { transform: 'translateX(0)', opacity: 1 },
                    '50%': { transform: 'translateX(5px)', opacity: 0.7 },
                    '100%': { transform: 'translateX(0)', opacity: 1 }
                  }
                }} />
              </Box>
            }
          >
            Calculate Prediction
            <Box 
              className="calculate-ripple"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: rippleEffect ? '300%' : '0%',
                height: rippleEffect ? '300%' : '0%',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                transition: rippleEffect ? 'all 1s ease-out' : 'none'
              }}
            />
          </Button>
        </Fade>
      </Box>
    </Paper>
  );
};

export default PredictionInputs;
