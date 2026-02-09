import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Grid, Typography, Paper, Divider, 
  List, ListItem, ListItemText, Button, Stack, Chip 
} from '@mui/material';
import { Receipt as ReceiptIcon, AddShoppingCart as AddIcon } from '@mui/icons-material';
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

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  if (!order) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Info */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Order #{order.id}
          </Typography>
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
        {/* LEFT: Current Order Items */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={2} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              <Typography variant="h6">Current Items</Typography>
            </Box>
            
            <List sx={{ minHeight: '400px' }}>
              {order.items.length === 0 ? (
                <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  No items added yet.
                </Typography>
              ) : (
                order.items.map((item: any) => (
                  <React.Fragment key={item.id}>
                    <ListItem secondaryAction={
                      <Typography fontWeight="bold">${item.subtotal}</Typography>
                    }>
                      <ListItemText 
                        primary={item.food_name} 
                        secondary={`Qty: ${item.quantity} @ $${item.price_at_order}`} 
                      />
                    </ListItem>
                    <Divider variant="middle" />
                  </React.Fragment>
                ))
              )}
            </List>

            <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5" fontWeight="bold">Total Amount</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  ${Number(order.total_amount).toFixed(2)}
                </Typography>
              </Stack>
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                color="success" 
                sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
              >
                Finalize & Close Order
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT: Food Selection Sidebar */}
        <Grid size={{ xs: 12, md: 5 }}>
          <FoodSelector 
            orderId={Number(id)} 
            onItemAdded={fetchOrderDetail} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetail;