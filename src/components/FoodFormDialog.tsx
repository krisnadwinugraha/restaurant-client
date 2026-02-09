import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Typography } from '@mui/material';
import api from '../api/axios';

const FoodFormDialog = ({ open, food, onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  useEffect(() => {
    if (food) setFormData({ name: food.name, price: food.price, category: food.category });
    else setFormData({ name: '', price: '', category: '' });
  }, [food]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const data = new FormData();
  data.append('name', formData.name);
  data.append('category', formData.category);
  data.append('price', formData.price);
    
  if (selectedFile) {
    data.append('image', selectedFile);
  }

  try {
    if (food) {
      // NOTE: Laravel sometimes has issues with PUT and FormData. 
      // A common trick is to use POST and add a _method spoof.
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
  } catch (err) {
    console.error("Upload failed", err);
  }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{food ? 'Edit Food' : 'Add New Food'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Food Name" 
              fullWidth 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
            <TextField 
              label="Category" 
              fullWidth 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
              required 
            />
            <TextField 
              label="Price" 
              type="number" 
              fullWidth 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
              required 
            />
            
            <Box>
              <Typography variant="caption" display="block" gutterBottom>Food Image</Typography>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FoodFormDialog;