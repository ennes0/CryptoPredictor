import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider
} from '@mui/material';

const RecentSearches = ({ 
  searches, 
  onSearchSelect, 
  onClearAll, 
  isDarkMode 
}) => {
  if (!searches || searches.length === 0) return null;
  
  return (
    <Box>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'inherit'
          }}
        >
          <Box component="span" className="material-icons-outlined" sx={{ 
            fontSize: 16,
            color: isDarkMode ? '#60a5fa' : undefined
          }}>
            history
          </Box>
          Recent Searches
        </Typography>
        <Button 
          size="small" 
          onClick={onClearAll}
          sx={{ 
            minWidth: 'auto', 
            px: 1, 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary', 
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : undefined
            }
          }}
        >
          Clear All
        </Button>
      </Box>
      <Divider />
      <List dense component="nav" className="recent-searches-list">
        {searches.map((crypto, index) => (
          <ListItem
            button
            key={crypto.id + index}
            onClick={() => onSearchSelect(crypto)}
            className="recent-search-item"
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={`https://cryptologos.cc/logos/${crypto.id}-${crypto.symbol.toLowerCase()}-logo.png?v=023`}
                alt={crypto.name}
                sx={{ 
                  width: 28, 
                  height: 28,
                  bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.05)'
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography 
                  variant="body2" 
                  component="span" 
                  sx={{ 
                    fontWeight: 600,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'inherit'
                  }}
                >
                  {crypto.name}
                </Typography>
              }
              secondary={
                <Typography 
                  variant="caption" 
                  color={isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
                  component="span" 
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  {crypto.symbol}
                  <Box 
                    component="span" 
                    sx={{ 
                      height: '4px', 
                      width: '4px', 
                      borderRadius: '50%', 
                      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'text.disabled',
                      display: 'inline-block'
                    }}
                  />
                  {crypto.price}
                </Typography>
              }
            />
            <Box 
              component="span" 
              className="material-icons-outlined" 
              sx={{ 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'action.active', 
                fontSize: 16,
                transition: 'transform 0.2s ease'
              }}
            >
              north_east
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecentSearches;
