import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Tabs, Tab, ImageList, ImageListItem, 
  ImageListItemBar, IconButton, Paper, Typography, InputAdornment, Skeleton 
} from '@mui/material';
import { AddCircle as AddIcon, Search as SearchIcon, RestaurantMenu } from '@mui/icons-material';
import api from '../api/axios';
import AddItemDialog from './AddItemDialog'; 

interface FoodSelectorProps {
  orderId: number;
  onItemAdded: () => void;
  disabled?: boolean;
}

const FoodSelector = ({ orderId, onItemAdded, disabled = false }: FoodSelectorProps) => {
  const [foods, setFoods] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('food');
  const [loading, setLoading] = useState(true);
  
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/food');
        setFoods(data.data);
      } catch (err) {
        console.error("Menu fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredFoods = foods.filter(f => 
    f.category === category && 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, category: string) => {
    const fallbackImage = category === 'drink' 
      ? '/images/default-drink.jpg' 
      : '/images/default-food.jpg';
    e.currentTarget.src = fallbackImage;
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        height: '100%', 
        minHeight: '600px',
        borderRadius: 3, 
        border: '1px solid',
        borderColor: 'grey.200',
        opacity: disabled ? 0.7 : 1, 
        pointerEvents: disabled ? 'none' : 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <RestaurantMenu color="primary" />
        <Typography variant="h6" fontWeight="bold">Menu Selection</Typography>
      </Box>
      
      <TextField
        fullWidth
        size="small"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Tabs 
        value={category} 
        onChange={(_, val) => setCategory(val)} 
        variant="fullWidth" 
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Food" value="food" sx={{ fontWeight: 'bold' }} />
        <Tab label="Drinks" value="drink" sx={{ fontWeight: 'bold' }} />
      </Tabs>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, maxHeight: '600px' }}>
        {loading ? (
          <Box sx={{ pt: 2 }}>
            <Skeleton variant="rectangular" height={100} sx={{ mb: 1, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 1, borderRadius: 2 }} />
          </Box>
        ) : filteredFoods.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            No items found.
          </Typography>
        ) : (
          <ImageList cols={2} gap={12}>
            {filteredFoods.map((item) => {
              const fallbackImage = item.category === 'drink' 
                  ? '/images/default-drink.jpg' 
                  : '/images/default-food.jpg';
              
              const imageSrc = item.image_url || fallbackImage;

              return (
                <ImageListItem 
                  key={item.id} 
                  sx={{ 
                    cursor: 'pointer', 
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    transition: '0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: 3 } 
                  }}
                  onClick={() => setSelectedFood(item)}
                >
                  <img
                    src={imageSrc}
                    alt={item.name}
                    loading="lazy"
                    style={{ height: '120px', objectFit: 'cover' }}
                    onError={(e) => handleImageError(e, item.category)}
                  />
                  <ImageListItemBar
                    title={<Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>}
                    subtitle={<Typography variant="caption">${item.price}</Typography>}
                    actionIcon={
                      <IconButton sx={{ color: 'white' }} size="small">
                        <AddIcon />
                      </IconButton>
                    }
                    sx={{ 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' 
                    }}
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        )}
      </Box>

      {selectedFood && (
        <AddItemDialog
          open={Boolean(selectedFood)}
          food={selectedFood}
          orderId={orderId}
          onClose={() => setSelectedFood(null)}
          onSuccess={() => {
            setSelectedFood(null);
            onItemAdded();
          }}
        />
      )}
    </Paper>
  );
};

export default FoodSelector;