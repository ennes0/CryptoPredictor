import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    const handleHover = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    const navElements = document.querySelectorAll('button, a, [role="button"]');
    navElements.forEach(element => {
      element.addEventListener('mouseenter', handleHover);
      element.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      navElements.forEach(element => {
        element.removeEventListener('mouseenter', handleHover);
        element.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <Box
      sx={{
        width: isHovered ? '30px' : '15px',
        height: isHovered ? '30px' : '15px',
        border: '2px solid #3b82f6',
        borderRadius: '50%',
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'width 0.2s, height 0.2s',
        transform: 'translate(-50%, -50%)',
        left: position.x,
        top: position.y,
      }}
    />
  );
};

export default CustomCursor; 