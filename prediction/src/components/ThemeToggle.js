import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';

const ThemeToggle = ({ isDarkMode, toggleDarkMode, isTransparent = false }) => {
  return (
    <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          color: isTransparent ? 'white' : isDarkMode ? 'white' : 'inherit',
          textShadow: isTransparent ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDarkMode ? 'rotateY(180deg)' : 'rotateY(0deg)',
          bgcolor: isTransparent ? 'rgba(255, 255, 255, 0.1)' : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          borderRadius: '50%',
          p: 1,
          '&:hover': {
            bgcolor: isTransparent ? 'rgba(255,255,255,0.2)' : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
            transform: `scale(1.1) ${isDarkMode ? 'rotateY(180deg)' : 'rotateY(0deg)'}`
          }
        }}
        className="theme-toggle-button"
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
