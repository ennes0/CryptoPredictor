import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Grid,
  Divider,
  Modal,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Avatar,
  LinearProgress
} from '@mui/material';
import { Close, ArrowUpward, ArrowDownward, ShowChart, InfoOutlined } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = 'http://localhost:8000';

const CryptoDetails = ({ symbol, onClose, onDebug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);

  useEffect(() => {
    const fetchCryptoDetails = async () => {
      try {
        if (onDebug) onDebug(`Fetching details for symbol: ${symbol}`);
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/crypto-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coin_symbol: symbol })
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (onDebug) onDebug(`Received data: ${JSON.stringify(data).substring(0, 100)}...`);

        if (data.success) {
          setCryptoData(data);
        } else {
          setError(data.error || 'Failed to fetch crypto details');
        }
      } catch (err) {
        if (onDebug) onDebug(`Error: ${err.message}`);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchCryptoDetails();
    }
  }, [symbol, onDebug]);

  const renderPriceChart = () => {
    if (!cryptoData || !cryptoData.price_history || cryptoData.price_history.length < 2) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No price history available</Typography>
        </Box>
      );
    }

    const sortedHistory = [...cryptoData.price_history]
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = {
      labels: sortedHistory.map(item => item.date),
      datasets: [
        {
          label: 'Price (USD)',
          data: sortedHistory.map(item => item.price),
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            return gradient;
          },
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleColor: 'rgb(255, 255, 255)',
          bodyColor: 'rgb(255, 255, 255)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return `$${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 0,
            maxTicksLimit: 6,
            color: 'rgb(156, 163, 175)'
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            },
            color: 'rgb(156, 163, 175)'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    };

    return (
      <Box sx={{ height: 300, position: 'relative' }}>
        <Line data={chartData} options={options} />
      </Box>
    );
  };

  const formatNumber = (num, prefix = '') => {
    if (num === null || num === undefined) return 'N/A';
    
    const absNum = Math.abs(Number(num));
    if (absNum >= 1e9) {
      return `${prefix}${(absNum / 1e9).toFixed(2)}B`;
    } else if (absNum >= 1e6) {
      return `${prefix}${(absNum / 1e6).toFixed(2)}M`;
    } else if (absNum >= 1e3) {
      return `${prefix}${(absNum / 1e3).toFixed(2)}K`;
    }
    
    return prefix + absNum.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const formatPercent = (num) => {
    if (num === null || num === undefined) return 'N/A';
    const value = parseFloat(num);
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="crypto-details-modal"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper 
        elevation={5} 
        sx={{ 
          width: '90%',
          maxWidth: 1000,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          p: 3,
          position: 'relative',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <Close />
        </IconButton>

        {loading && (
          <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
            <CircularProgress size={40} thickness={4} />
            <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading {symbol} details...</Typography>
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              '& .MuiAlert-message': {
                flex: 1
              }
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Failed to load crypto details
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </Box>
          </Alert>
        )}

        {cryptoData && !loading && !error && (
          <>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={cryptoData?.image || `https://cryptologos.cc/logos/${cryptoData?.id}-${cryptoData?.symbol?.toLowerCase()}-logo.png`}
                alt={cryptoData?.name}
                sx={{ width: 64, height: 64, mr: 2 }}
                onError={(e) => {
                  e.target.src = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${cryptoData?.symbol?.toLowerCase()}.png`;
                }}
              />
              <Box>
                <Typography variant="h4">{cryptoData?.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip label={cryptoData.symbol} size="small" />
                  <Chip
                    label={formatPercent(cryptoData.price_change_percentage_24h)}
                    size="small"
                    color={cryptoData.price_change_percentage_24h > 0 ? "success" : "error"}
                    icon={cryptoData.price_change_percentage_24h > 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                  />
                  {cryptoData.market_cap_rank && (
                    <Chip
                      label={`Rank #${cryptoData.market_cap_rank}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
              <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${formatNumber(cryptoData.current_price)}
                </Typography>
                <Typography 
                  variant="body2"
                  color={cryptoData.price_change_percentage_24h > 0 ? "success.main" : "error.main"}
                >
                  {cryptoData.price_change_percentage_24h > 0 ? "+" : ""}
                  {formatPercent(cryptoData.price_change_percentage_24h)} (24h)
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Price Chart */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShowChart /> Price Chart (30 days)
              </Typography>
              {renderPriceChart()}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Key Metrics */}
            <Typography variant="h6" gutterBottom>Key Metrics</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                  <Typography variant="h6">{formatNumber(cryptoData.market_cap, '$')}</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">24h Trading Volume</Typography>
                  <Typography variant="h6">{formatNumber(cryptoData.total_volume, '$')}</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">Circulating Supply</Typography>
                  <Typography variant="h6">{formatNumber(cryptoData.circulating_supply)}</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">Max Supply</Typography>
                  <Typography variant="h6">{cryptoData.max_supply ? formatNumber(cryptoData.max_supply) : 'Unlimited'}</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Price Changes */}
            <Typography variant="h6" gutterBottom>Price Changes</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { period: '24h', value: cryptoData.price_change_percentage_24h },
                { period: '7d', value: cryptoData.price_change_percentage_7d },
                { period: '30d', value: cryptoData.price_change_percentage_30d }
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">{item.period} Change</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {item.value !== null && (
                        <Box sx={{ 
                          color: item.value > 0 ? 'success.main' : 'error.main',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {item.value > 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                          <Typography variant="h6" sx={{ ml: 0.5 }}>
                            {formatPercent(item.value)}
                          </Typography>
                        </Box>
                      )}
                      {item.value === null && (
                        <Typography variant="body1">N/A</Typography>
                      )}
                    </Box>
                    <LinearProgress 
                      variant="determinate"
                      value={50 + (item.value || 0)}
                      color={item.value > 0 ? "success" : "error"}
                      sx={{ mt: 1, height: 6, borderRadius: 3, minWidth: '100%' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Additional Stats */}
            <Typography variant="h6" gutterBottom>Additional Stats</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">All-Time High</TableCell>
                    <TableCell align="right">
                      ${formatNumber(cryptoData.ath)}
                      {cryptoData.ath_date && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          on {formatDate(cryptoData.ath_date)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {cryptoData.ath_change_percentage && (
                        <Chip 
                          label={`${formatPercent(cryptoData.ath_change_percentage)} from ATH`}
                          size="small"
                          color={cryptoData.ath_change_percentage > -10 ? "success" : "error"}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">All-Time Low</TableCell>
                    <TableCell align="right">
                      ${formatNumber(cryptoData.atl)}
                      {cryptoData.atl_date && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          on {formatDate(cryptoData.atl_date)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {cryptoData.atl_change_percentage && (
                        <Chip 
                          label={`+${formatPercent(Math.abs(cryptoData.atl_change_percentage))} from ATL`}
                          size="small"
                          color="success"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">24h High / Low</TableCell>
                    <TableCell align="right" colSpan={2}>
                      ${formatNumber(cryptoData.high_24h)} / ${formatNumber(cryptoData.low_24h)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Last Updated</TableCell>
                    <TableCell align="right" colSpan={2}>
                      {cryptoData.last_updated ? formatDate(cryptoData.last_updated) : 'N/A'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Description */}
            {cryptoData.description && (
              <>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoOutlined /> About {cryptoData.name}
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 3,
                    maxHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: cryptoData.description }} />
                </Paper>
              </>
            )}
          </>
        )}
      </Paper>
    </Modal>
  );
};

export default CryptoDetails;