import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider
} from '@mui/material';

const SearchCategories = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  isDarkMode 
}) => {
  return (
    <Box sx={{ pt: 1, pb: 2 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          mb: 1.5, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          px: 2,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'inherit'
        }}
      >
        <Box component="span" className="material-icons-outlined" sx={{ 
          fontSize: 16,
          color: isDarkMode ? '#60a5fa' : 'primary.main'
        }}>
          category
        </Box>
        Categories
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: 2 }}>
        {categories.map(category => (
          <Chip
            key={category.id}
            label={category.name}
            icon={
              <Box component="span" className="material-icons-outlined" sx={{ 
                fontSize: 16,
                color: selectedCategory === category.id && isDarkMode ? '#fff' : undefined
              }}>
                {category.icon}
              </Box>
            }
            onClick={() => onCategoryChange(category.id)}
            color={selectedCategory === category.id ? "primary" : "default"}
            variant={selectedCategory === category.id ? "filled" : "outlined"}
            className={`category-chip ${selectedCategory === category.id ? 'active-category' : ''}`}
            sx={{ 
              borderRadius: '30px', 
              transition: 'all 0.2s ease',
              background: selectedCategory === category.id ? 
                (isDarkMode ? 'linear-gradient(90deg, #3b82f6, #6366f1)' : undefined) : 
                (isDarkMode ? 'rgba(30, 41, 59, 0.4)' : undefined),
              border: '1px solid',
              borderColor: isDarkMode && selectedCategory !== category.id ? 
                'rgba(255, 255, 255, 0.1)' : undefined,
              color: isDarkMode && selectedCategory !== category.id ? 
                'rgba(255, 255, 255, 0.7)' : undefined
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SearchCategories;
