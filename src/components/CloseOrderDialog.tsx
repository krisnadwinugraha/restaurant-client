import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, CircularProgress 
} from '@mui/material';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';

interface CloseOrderProps {
  open: boolean;
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CloseOrderDialog = ({ open, order, onClose, onSuccess }: CloseOrderProps) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleConfirmClose = async () => {
    setLoading(true);
    try {
      await api.post(`/orders/${order.id}/close`);
      
      showNotification("Order finalized! Table is now available.", "success");
      onSuccess(); 
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to close order";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold' }}>Finalize Payment</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1">Order ID: <strong>#{order?.id}</strong></Typography>
          <Typography variant="body1">Table: <strong>{order?.table_number}</strong></Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total Amount:</Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              ${Number(order?.total_amount).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleConfirmClose} 
          disabled={loading || !order?.items?.length}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Processing...' : 'Confirm & Close Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseOrderDialog;