import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const AnimatedNumber = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  duration = 1000,
  variant = 'body1',
  color = 'inherit',
  sx = {}
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTimestamp;
    const startValue = displayValue;
    const endValue = value;
    
    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const currentValue = startValue + (endValue - startValue) * progress;
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else if (num >= 1) {
      return num.toFixed(2);
    } else {
      return num.toFixed(6);
    }
  };

  return (
    <Typography variant={variant} color={color} sx={sx}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </Typography>
  );
};

export default AnimatedNumber;
