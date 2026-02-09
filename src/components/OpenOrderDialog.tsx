import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, CircularProgress, Alert 
} from '@mui/material';
import api from '../api/axios';

interface OpenOrderDialogProps {
  open: boolean;
  table: { id: number; table_number: number } | null;
  onClose: () => void;
  onSuccess: (orderId: number) => void;
}

const OpenOrderDialog = ({ open, table, onClose, onSuccess }: OpenOrderDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!table) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/orders', {
        table_id: table.id
      });
      // Assuming your OrderResource returns { data: { id: ... } }
      onSuccess(data.data.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to open order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Open New Order</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography>
          Are you sure you want to open a new order for <strong>Table {table?.table_number}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleConfirm} 
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Confirm & Open
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenOrderDialog;