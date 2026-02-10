import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Grid, Typography, Paper, Button, Stack, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import { 
  Receipt as ReceiptIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import api from '../api/axios';
import FoodSelector from '../components/FoodSelector';
import CloseOrderDialog from '../components/CloseOrderDialog';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State Management
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  // Fetching Logic
  const fetchOrderDetail = useCallback(async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // Item Action Handlers
  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm('Remove this item from the order?')) {
      try {
        await api.delete(`/orders/${id}/items/${itemId}`);
        fetchOrderDetail(); 
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/orders/${id}/items/${itemId}`, { quantity: newQty });
      fetchOrderDetail();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleCloseSuccess = () => {
    setIsCloseDialogOpen(false);
    navigate('/', { state: { message: `Order #${id} finalized.` } });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  if (error || !order) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error || "Order not found."}</Alert>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Back to Dashboard
      </Button>
    </Box>
  );

  const isPending = order.status === 'pending';

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Button 
            startIcon={<BackIcon />} 
            onClick={() => navigate('/')} 
            sx={{ mb: 1, p: 0 }}
          >
            Dashboard
          </Button>
          <Typography variant="h4" fontWeight="bold">Order #{order.id}</Typography>
          <Typography color="text.secondary">
            Table {order.table_number} • Waiter: {order.waiter_name}
          </Typography>
        </Box>
        <Chip 
          label={order.status.toUpperCase()} 
          color={isPending ? 'warning' : 'success'} 
          sx={{ fontWeight: 'bold', px: 2, height: 32 }}
        />
      </Stack>

      <Grid container spacing={3}>
        {/* LEFT COLUMN: Receipt / Items Table */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              <Typography variant="h6">Current Order</Typography>
            </Box>
            
            <TableContainer sx={{ flexGrow: 1, minHeight: '400px' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                    {isPending && <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isPending ? 4 : 3} align="center" sx={{ py: 10 }}>
                        <Typography color="text.secondary">Order is currently empty.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    order.items.map((item: any) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">{item.food_name}</Typography>
                          {item.notes && (
                            <Typography variant="caption" color="error" display="block" sx={{ fontStyle: 'italic' }}>
                              Note: {item.notes}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {isPending ? (
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                              <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                                <RemoveIcon fontSize="inherit" />
                              </IconButton>
                              <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                <AddIcon fontSize="inherit" />
                              </IconButton>
                            </Stack>
                          ) : (
                            <Typography variant="body2">{item.quantity}</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            ${Number(item.subtotal).toFixed(2)}
                          </Typography>
                        </TableCell>
                        {isPending && (
                          <TableCell align="center">
                            <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Footer / Total Section */}
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Grand Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  ${Number(order.total_amount).toFixed(2)}
                </Typography>
              </Stack>
              
              {isPending && (
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  color="success" 
                  onClick={() => setIsCloseDialogOpen(true)}
                  disabled={order.items.length === 0}
                  sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  Finalize & Close Order
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: Food Selector Sidebar */}
        <Grid size={{ xs: 12, md: 5 }}>
          <FoodSelector 
            orderId={Number(id)} 
            onItemAdded={fetchOrderDetail} 
            disabled={!isPending}
          />
        </Grid>
      </Grid>

      {/* Close Order Confirmation */}
      {order && (
        <CloseOrderDialog 
          open={isCloseDialogOpen}
          order={order}
          onClose={() => setIsCloseDialogOpen(false)}
          onSuccess={handleCloseSuccess}
        />
      )}
    </Box>
  );
};

export default OrderDetail;