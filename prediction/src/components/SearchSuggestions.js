import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const SearchSuggestions = ({ suggestions, onSuggestionClick, isDarkMode, title = "Popular Searches" }) => {
  return (
    <Box sx={{ pt: 1, pb: 2 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          mb: 1.5, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          px: 2
        }}
      >
        <Box component="span" className="material-icons-outlined" sx={{ fontSize: 16, color: 'primary.main' }}>
          whatshot
        </Box>
        {title}
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={1} sx={{ px: 1.5 }}>
        {suggestions.map((crypto, index) => (
          <Grid item xs={6} sm={4} key={crypto.id + index}>
            <Box
              onClick={() => onSuggestionClick(crypto)}
              sx={{
                p: 1.5,
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                background: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.05)',
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'
                }
              }}
              className="suggestion-item"
            >
              <Avatar
                src={`https://cryptologos.cc/logos/${crypto.id}-${crypto.symbol.toLowerCase()}-logo.png?v=023`}
                alt={crypto.name}
                sx={{ 
                  width: 28, 
                  height: 28,
                  bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.05)'
                }}
              />
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    lineHeight: 1.2,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'inherit'
                  }}
                >
                  {crypto.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                    }}
                  >
                    {crypto.symbol}
                  </Typography>
                  {crypto.trend && (
                    <Typography
                      variant="caption"
                      color={crypto.trend.startsWith('+') ? 
                        (isDarkMode ? '#4ade80' : 'success.main') : 
                        (isDarkMode ? '#f87171' : 'error.main')}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.2,
                        fontWeight: 'medium' 
                      }}
                    >
                      {crypto.trend}
                      {crypto.trend.startsWith('+') ? (
                        <TrendingUp sx={{ fontSize: 10 }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 10 }} />
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchSuggestions;
