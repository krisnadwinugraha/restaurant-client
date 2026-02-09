import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Typography, Divider, Stack 
} from '@mui/material';
import api from '../api/axios';

const AddItemDialog = ({ open, food, orderId, onClose, onSuccess }: any) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await api.post(`/orders/${orderId}/items`, {
        food_id: food.id,
        quantity: quantity,
        notes: notes
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to add item", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold' }}>Add {food.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">Unit Price:</Typography>
            <Typography variant="body1" fontWeight="bold">${food.price}</Typography>
          </Box>
          
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Special Instructions"
            placeholder="e.g. No onions, extra ice..."
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Subtotal:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${(food.price * quantity).toFixed(2)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleAdd} 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Confirm Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;