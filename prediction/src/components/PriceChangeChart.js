import React from 'react';
import { Box, Typography } from '@mui/material';
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

const PriceChangeChart = ({
  startPrice,
  endPrice,
  isDarkMode,
  timeframe,
  onAnimationComplete,
  animated
}) => {
  const generateDataPoints = () => {
    const points = [];
    const steps = 50;
    const priceDiff = endPrice - startPrice;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const price = startPrice + (priceDiff * progress);
      points.push(price);
    }
    
    return points;
  };

  const data = {
    labels: Array(51).fill(''),
    datasets: [
      {
        label: 'Price Prediction',
        data: generateDataPoints(),
        borderColor: endPrice >= startPrice ? '#10B981' : '#EF4444',
        backgroundColor: endPrice >= startPrice 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: animated ? 1000 : 0,
      easing: 'easeInOutQuart',
      onComplete: onAnimationComplete
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false,
        beginAtZero: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <Box sx={{ height: '300px', position: 'relative', mb: 4 }}>
      <Line data={data} options={options} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              fontWeight: 'bold'
            }}
          >
            ${startPrice?.toLocaleString()}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: endPrice >= startPrice ? '#10B981' : '#EF4444',
              fontWeight: 'bold'
            }}
          >
            ${endPrice?.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PriceChangeChart;
