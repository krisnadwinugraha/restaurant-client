import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import api from '../api/axios';

const AddItemDialog = ({ open, food, orderId, onClose, onSuccess }: any) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAdd = async () => {
    try {
      await api.post(`/orders/${orderId}/items`, {
        food_id: food.id,
        quantity: quantity,
        notes: notes
      });
      onSuccess();
    } catch (err) {
      console.error("Add item failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add {food.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          />
          <TextField
            label="Notes (Optional)"
            placeholder="e.g. Extra spicy, No ice"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>Add to Order</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;