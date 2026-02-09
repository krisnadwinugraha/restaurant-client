import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Tabs, Tab, ImageList, ImageListItem, 
  ImageListItemBar, IconButton, Paper, Typography, InputAdornment 
} from '@mui/material';
import { AddCircle as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import api from '../api/axios';
import AddItemDialog from './AddItemDialog'; 

interface FoodSelectorProps {
  orderId: number;
  onItemAdded: () => void;
}

const FoodSelector = ({ orderId, onItemAdded }: FoodSelectorProps) => {
  const [foods, setFoods] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('food');
  
  // Dialog State
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await api.get('/food');
      setFoods(data.data);
    };
    fetchMenu();
  }, []);

  // Filter logic: Match category AND search text
  const filteredFoods = foods.filter(f => 
    f.category === category && 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Add Items</Typography>
      
      <TextField
        fullWidth
        size="small"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Tabs 
        value={category} 
        onChange={(_, val) => setCategory(val)} 
        variant="fullWidth" 
        sx={{ mb: 2 }}
      >
        <Tab label="Food" value="food" />
        <Tab label="Drinks" value="drink" />
      </Tabs>

      <Box sx={{ height: '500px', overflowY: 'auto' }}>
        <ImageList cols={2} gap={12}>
          {filteredFoods.map((item) => (
            <ImageListItem 
              key={item.id} 
              sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              onClick={() => setSelectedFood(item)}
            >
              <img
                src={item.image_url}
                alt={item.name}
                loading="lazy"
                style={{ borderRadius: '8px', height: '120px', objectFit: 'cover' }}
              />
              <ImageListItemBar
                title={item.name}
                subtitle={`$${item.price}`}
                sx={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}
                actionIcon={
                  <IconButton sx={{ color: 'white' }}>
                    <AddIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {selectedFood && (
        <AddItemDialog
          open={!!selectedFood}
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