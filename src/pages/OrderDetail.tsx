import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, Paper, Button, Stack, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { 
  Receipt as ReceiptIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon 
} from '@mui/icons-material';
import api from '../api/axios';
import FoodSelector from '../components/FoodSelector';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
    } catch (err) {
      console.error("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  if (!order) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Order #{order.id}</Typography>
          <Typography color="text.secondary">
            Table {order.table_number} • Waiter: {order.waiter_name}
          </Typography>
        </Box>
        <Chip 
          label={order.status.toUpperCase()} 
          color={order.status === 'pending' ? 'warning' : 'success'} 
          sx={{ fontWeight: 'bold' }}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              <Typography variant="h6">Current Items</Typography>
            </Box>
            
            <TableContainer sx={{ minHeight: '400px' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">No items added yet.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    order.items.map((item: any) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">{item.food_name}</Typography>
                          {item.notes && (
                            <Typography variant="caption" color="error" display="block">
                              Note: {item.notes}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                            <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                              <RemoveIcon fontSize="inherit" />
                            </IconButton>
                            <Typography variant="body2">{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                              <AddIcon fontSize="inherit" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">${Number(item.subtotal).toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ p: 3, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  ${Number(order.total_amount).toFixed(2)}
                </Typography>
              </Stack>
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                color="success" 
                sx={{ py: 1.5, fontWeight: 'bold' }}
                disabled={order.items.length === 0 || order.status !== 'pending'}
              >
                Finalize & Close Order
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <FoodSelector 
            orderId={Number(id)} 
            onItemAdded={fetchOrderDetail} 
            disabled={order.status !== 'pending'}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetail;