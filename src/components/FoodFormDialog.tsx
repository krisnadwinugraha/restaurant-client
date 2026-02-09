import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, 
  Button, Box, Typography, Alert, CircularProgress, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import api from '../api/axios';

interface FoodFormProps {
  open: boolean;
  food: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FoodFormDialog = ({ open, food, onClose, onSuccess }: FoodFormProps) => {
  const [formData, setFormData] = useState({ name: '', price: '', category: 'food' }); // Default to 'food'
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (food) {
      setFormData({ 
        name: food.name, 
        price: food.price.toString(), 
        category: food.category 
      });
    } else {
      setFormData({ name: '', price: '', category: 'food' });
    }
    setSelectedFile(null);
  }, [food, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    
    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      if (food) {
        data.append('_method', 'PUT');
        await api.post(`/food/${food.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/food', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{food ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField 
              label="Name" 
              fullWidth 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            {/* Dropdown for Enum Category */}
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="drink">Drink</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              label="Price" 
              type="number" 
              fullWidth 
              required 
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Food Image {food && '(Optional)'}
              </Typography>
              <Button variant="outlined" component="label" fullWidth>
                {selectedFile ? selectedFile.name : "Choose File"}
                <input 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} 
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (food ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FoodFormDialog;