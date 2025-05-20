import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
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
import { getRelativePosition } from 'chart.js/helpers'; // Import helpers directly
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

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

const PriceHistoryChart = ({ data, isDarkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const theme = useTheme();
  
  useEffect(() => {
    if (!data || data.length === 0) {
      setIsLoading(true);
      return;
    }
    
    // Process the data for Chart.js
    const labels = data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
    
    const prices = data.map(item => item.price);
    
    // Determine if price trend is positive or negative
    const priceChange = prices[prices.length - 1] - prices[0];
    const isPositive = priceChange >= 0;
    
    // Calculate percentage change
    const percentChange = ((priceChange / prices[0]) * 100).toFixed(2);
    
    // Set gradient colors based on price trend and theme
    const gradientColors = {
      start: isPositive 
        ? 'rgba(16, 185, 129, 0.6)' 
        : 'rgba(239, 68, 68, 0.6)',
      middle: isPositive 
        ? 'rgba(16, 185, 129, 0.2)' 
        : 'rgba(239, 68, 68, 0.2)',
      end: isDarkMode 
        ? 'rgba(30, 41, 59, 0.01)' 
        : 'rgba(255, 255, 255, 0.01)'
    };
    
    const borderColor = isPositive 
      ? 'rgba(16, 185, 129, 1)' 
      : 'rgba(239, 68, 68, 1)';
    
    // Initialize chart data
    const preparedChartData = {
      labels,
      datasets: [
        {
          label: 'Price',
          data: prices,
          borderColor: borderColor,
          tension: 0.4,
          pointRadius: (context) => {
            // Make first and last points larger
            const index = context.dataIndex;
            if (index === 0 || index === prices.length - 1) {
              return 5;
            }
            // Show a few strategic points in middle
            if (index % Math.ceil(prices.length / 6) === 0) {
              return 3;
            }
            return 0; // Hide other points for cleaner look
          },
          pointBackgroundColor: (context) => {
            const index = context.dataIndex;
            if (index === prices.length - 1) {
              return borderColor;
            }
            return isDarkMode ? '#1e1e2d' : '#ffffff';
          },
          pointBorderColor: borderColor,
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: borderColor,
          pointHoverBorderColor: isDarkMode ? '#1e1e2d' : '#ffffff',
          pointHoverBorderWidth: 3,
          fill: true,
          backgroundColor: (context) => {
            if (!context.chart.chartArea) {
              return;
            }
            
            const { ctx, chartArea } = context.chart;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, gradientColors.start);
            gradient.addColorStop(0.5, gradientColors.middle);
            gradient.addColorStop(1, gradientColors.end);
            return gradient;
          }
        }
      ]
    };
    
    setChartData({
      chartData: preparedChartData,
      percentChange,
      isPositive
    });
    setIsLoading(false);
  }, [data, isDarkMode]);
  
  // Handle hover event to display detailed data
  const handleHover = (event) => {
    if (!chartRef.current) return;
    
    const chart = chartRef.current;
    
    if (event.type === 'mousemove') {
      const canvasPosition = getRelativePosition(event, chart); // Use imported helper
      const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
      
      if (dataX !== undefined && dataX >= 0 && dataX < data.length) {
        const index = Math.round(dataX);
        setHoveredData({
          date: new Date(data[index].date).toLocaleDateString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric' 
          }),
          price: data[index].price,
          index
        });
      }
    } else if (event.type === 'mouseout') {
      setHoveredData(null);
    }
  };
  
  // Format price with appropriate precision
  const formatPrice = (price) => {
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(2);
    if (price < 1000) return price.toFixed(2);
    return price.toLocaleString(undefined, {maximumFractionDigits: 2});
  };
  
  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#e2e8f0' : '#334155',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            const item = tooltipItems[0];
            const index = item.dataIndex;
            const date = new Date(data[index].date);
            return date.toLocaleDateString(undefined, { 
              year: 'numeric', month: 'long', day: 'numeric' 
            });
          },
          label: (tooltipItem) => {
            return `Price: $${formatPrice(tooltipItem.raw)}`;
          },
          labelTextColor: () => {
            return isDarkMode ? '#e2e8f0' : '#334155';
          },
          afterLabel: (tooltipItem) => {
            if (tooltipItem.dataIndex > 0) {
              const currentPrice = tooltipItem.raw;
              const previousPrice = data[tooltipItem.dataIndex - 1].price;
              const change = ((currentPrice - previousPrice) / previousPrice) * 100;
              return `Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6
        }
      },
      y: {
        position: 'right',
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          callback: function(value) {
            return '$' + formatPrice(value);
          },
          maxTicksLimit: 5
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    onHover: handleHover
  };
  
  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: isDarkMode ? '0 8px 30px rgba(0,0,0,0.2)' : '0 8px 30px rgba(0,0,0,0.1)'
        },
        p: 2
      }}
    >
      {/* Header with percentage change */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1.5
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Price History (30 Days)
        </Typography>
        
        {!isLoading && chartData && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5,
              bgcolor: chartData.isPositive ? 'success.light' : 'error.light',
              color: 'white',
              borderRadius: '12px',
              px: 1.5,
              py: 0.5,
              animation: 'fadeIn 0.5s ease-out'
            }}
          >
            {chartData.isPositive ? 
              <TrendingUp fontSize="small" /> : 
              <TrendingDown fontSize="small" />
            }
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {chartData.isPositive ? '+' : ''}{chartData.percentChange}%
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Chart area */}
      <Box sx={{ 
        height: 'calc(100% - 40px)', 
        position: 'relative',
        '.chartjs-tooltip': {
          opacity: 0,
          position: 'absolute',
          backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          color: isDarkMode ? '#fff' : '#000',
          borderRadius: '8px',
          transition: 'all .1s ease',
          pointerEvents: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          borderWidth: '1px',
          borderStyle: 'solid',
          transform: 'translate(-50%, 0)',
          zIndex: 10
        }
      }}>
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%' 
          }}>
            <Typography color="text.secondary">Loading chart data...</Typography>
          </Box>
        ) : chartData ? (
          <Line 
            ref={chartRef}
            data={chartData.chartData} 
            options={options} 
            className="price-history-chart"
          />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%' 
          }}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        )}
      </Box>
      
      {/* Hovered data display */}
      {hoveredData && (
        <Box 
          sx={{
            position: 'absolute',
            top: 15,
            left: 15,
            bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            p: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            zIndex: 5,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {hoveredData.date}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            ${formatPrice(hoveredData.price)}
          </Typography>
          
          {hoveredData.index > 0 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              mt: 0.5
            }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%',
                bgcolor: hoveredData.price >= data[hoveredData.index - 1].price 
                  ? 'success.main' 
                  : 'error.main'
              }} />
              <Typography 
                variant="caption" 
                color={hoveredData.price >= data[hoveredData.index - 1].price 
                  ? 'success.main' 
                  : 'error.main'}
              >
                {hoveredData.price >= data[hoveredData.index - 1].price ? '+' : ''}
                {((hoveredData.price - data[hoveredData.index - 1].price) / data[hoveredData.index - 1].price * 100).toFixed(2)}%
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PriceHistoryChart;
