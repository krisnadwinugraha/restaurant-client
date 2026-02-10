import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Grid, Typography, Paper, Button, Stack, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import { 
  Receipt as ReceiptIcon, Delete as DeleteIcon, Add as AddIcon, 
  Remove as RemoveIcon, ArrowBack as BackIcon, TableRestaurant, Person, Download as DownloadIcon
} from '@mui/icons-material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FoodSelector from '../components/FoodSelector';
import CloseOrderDialog from '../components/CloseOrderDialog';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrderDetail(); }, [fetchOrderDetail]);

  const isOpen = order?.status?.toLowerCase() === 'open';
  const canEditItems = isOpen && user?.roles.includes('waiter');
  const canCloseOrder = isOpen && (user?.roles.includes('waiter') || user?.roles.includes('cashier'));

  const handleRemoveItem = async (itemId: number) => {
    if (!window.confirm('Remove this item from the order?')) return;
    try {
      await api.delete(`/orders/${id}/items/${itemId}`);
      fetchOrderDetail(); 
    } catch (err) { console.error("Delete failed", err); }
  };

  const handleUpdateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/orders/${id}/items/${itemId}`, { quantity: newQty });
      fetchOrderDetail();
    } catch (err) { console.error("Update failed", err); }
  };

  // PDF Download Handler
  const handleDownloadReceipt = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const downloadUrl = `${apiUrl}/orders/${order.id}/receipt`;
    window.open(downloadUrl, '_blank');
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error || !order) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Dashboard</Button>
    </Box>
  );

  return (
    <Box sx={{ pb: 4 }}>
      {/* HEADER SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 3 }}>
        <Box>
          <Button 
            startIcon={<BackIcon />} 
            onClick={() => navigate('/')} 
            sx={{ mb: 1, color: 'text.secondary', fontWeight: 'bold', textTransform: 'none' }}
          >
            Back to Dashboard
          </Button>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" fontWeight="bold">Order #{order.id}</Typography>
            <Chip 
              label={order.status.toUpperCase()} 
              color={isOpen ? 'primary' : 'success'} 
              sx={{ fontWeight: 'bold', borderRadius: 1.5 }} 
            />
          </Stack>
          <Stack direction="row" spacing={3} sx={{ mt: 1, color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TableRestaurant fontSize="small" /> <Typography variant="body2">Table {order.table_number}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person fontSize="small" /> <Typography variant="body2">Waiter: {order.waiter_name}</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* RECEIPT PANEL */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200', overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon color="action" />
              <Typography variant="h6" fontWeight="bold">Order Summary</Typography>
            </Box>
            
            <TableContainer sx={{ minHeight: '350px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ITEM</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>QTY</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>SUBTOTAL</TableCell>
                    {canEditItems && <TableCell align="center" sx={{ fontWeight: 'bold' }}>ACTION</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.length === 0 ? (
                    <TableRow><TableCell colSpan={canEditItems ? 4 : 3} align="center" sx={{ py: 4, color: 'text.secondary' }}>No items added.</TableCell></TableRow>
                  ) : (
                    order.items.map((item: any) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">{item.food_name}</Typography>
                          {item.notes && <Typography variant="caption" color="warning.main">Note: {item.notes}</Typography>}
                        </TableCell>
                        <TableCell align="center">
                          {canEditItems ? (
                            <Paper elevation={0} sx={{ display: 'inline-flex', alignItems: 'center', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                              <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                <RemoveIcon fontSize="inherit" />
                              </IconButton>
                              <Typography sx={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                              <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                <AddIcon fontSize="inherit" />
                              </IconButton>
                            </Paper>
                          ) : (
                            <Typography variant="body2" fontWeight="bold">x{item.quantity}</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">${Number(item.subtotal).toFixed(2)}</TableCell>
                        {canEditItems && (
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

            {/* FOOTER TOTALS & ACTIONS */}
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'grey.200' }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Grand Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  ${Number(order.total_amount).toFixed(2)}
                </Typography>
              </Stack>
              
              {/* Logic: Show Payment Button if Open, OR Show Receipt Button if Closed */}
              {canCloseOrder ? (
                <Button 
                  fullWidth variant="contained" size="large" color="success" 
                  onClick={() => setIsCloseDialogOpen(true)}
                  disabled={order.items.length === 0}
                  sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                  Process Final Payment
                </Button>
              ) : !isOpen ? (
                <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReceipt}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                    Download PDF Receipt
                </Button>
              ) : null}

            </Box>
          </Paper>
        </Grid>

        {/* MENU SELECTOR */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FoodSelector 
            orderId={Number(id)} 
            onItemAdded={fetchOrderDetail} 
            disabled={!canEditItems} 
          />
        </Grid>
      </Grid>

      <CloseOrderDialog 
        open={isCloseDialogOpen} 
        order={order} 
        onClose={() => setIsCloseDialogOpen(false)} 
        onSuccess={() => navigate('/')} 
      />
    </Box>
  );
};

export default OrderDetail;