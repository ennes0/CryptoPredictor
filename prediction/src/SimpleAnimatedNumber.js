import React, { useState, useEffect } from 'react';

/**
 * A simple animated number component as fallback for the more complex AnimatedNumber
 */
const SimpleAnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    // Convert value to number
    let numericValue = 0;
    if (typeof value === 'string') {
      numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    } else if (typeof value === 'number') {
      numericValue = value;
    }
    
    // Ensure valid number
    if (isNaN(numericValue)) {
      numericValue = 0;
    }
    
    setDisplayValue(numericValue);
  }, [value]);
  
  // Format the display value with commas and decimal points
  const formattedValue = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return (
    <span className="animated-number">
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

export default SimpleAnimatedNumber;
