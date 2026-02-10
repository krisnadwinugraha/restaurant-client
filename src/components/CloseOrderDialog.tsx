import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, Stack, CircularProgress 
} from '@mui/material';
import { CheckCircleOutline as SuccessIcon } from '@mui/icons-material';
import api from '../api/axios';

interface CloseOrderProps {
  open: boolean;
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CloseOrderDialog = ({ open, order, onClose, onSuccess }: CloseOrderProps) => {
  const [loading, setLoading] = useState(false);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      // API call to finalize the order and free the table
      await api.post(`/orders/${order.id}/finalize`);
      onSuccess();
    } catch (err) {
      console.error("Payment failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <SuccessIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h5" fontWeight="bold">Finalize Payment</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Table Number</Typography>
              <Typography fontWeight="bold">{order.table_number}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Total Items</Typography>
              <Typography fontWeight="bold">{order.items.length}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Amount Due</Typography>
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                ${Number(order.total_amount).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} disabled={loading} fullWidth>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          fullWidth 
          onClick={handleFinalize}
          disabled={loading || order.items.length === 0}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseOrderDialog;