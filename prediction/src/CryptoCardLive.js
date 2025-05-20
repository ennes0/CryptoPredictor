import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

// This component adds interactive sparkle effects to crypto cards
const CryptoCardLive = ({ cardId }) => {
  const sparkleContainerRef = useRef(null);
  
  useEffect(() => {
    const container = sparkleContainerRef.current;
    if (!container) return;
    
    // Create sparkles
    const createSparkle = () => {
      if (!container) return;
      
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      
      // Random position within the container
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      
      // Random size for variety
      const size = Math.random() * 3 + 1;
      
      // Random delay for natural effect
      const delay = Math.random() * 2;
      
      // Set styles
      sparkle.style.top = `${top}%`;
      sparkle.style.left = `${left}%`;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.animationDelay = `${delay}s`;
      
      // Add to container
      container.appendChild(sparkle);
      
      // Remove after animation completes
      setTimeout(() => {
        if (container.contains(sparkle)) {
          container.removeChild(sparkle);
        }
      }, 2000 + (delay * 1000));
    };
    
    // Create initial sparkles
    for (let i = 0; i < 5; i++) {
      createSparkle();
    }
    
    // Create new sparkles periodically
    const intervalId = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to create a new sparkle
        createSparkle();
      }
    }, 500);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
    };
  }, [cardId]);
  
  return (
    <Box 
      ref={sparkleContainerRef}
      className="sparkle-effect"
      sx={{ pointerEvents: 'none' }}
    />
  );
};

export default CryptoCardLive;
