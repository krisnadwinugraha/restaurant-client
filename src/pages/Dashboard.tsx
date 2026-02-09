import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Don't forget this import
import api from '../api/axios';
import TableCard from '../components/TableCard';
import OpenOrderDialog from '../components/OpenOrderDialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTable, setSelectedTable] = useState<{ id: number, table_number: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tables');
      setTables(data.data);
    } catch (err: any) {
      setError('Failed to load tables. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleOpenOrderClick = (table: any) => {
    setSelectedTable(table);
    setDialogOpen(true);
  };

  const handleOrderSuccess = (orderId: number) => {
    setDialogOpen(false);
    navigate(`/orders/${orderId}`);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Table Overview
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {tables.map((table: any) => (
          <Grid key={table.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <TableCard 
              table={table} 
              onOpenOrder={() => handleOpenOrderClick(table)} 
            />
          </Grid>
        ))}
      </Grid>

      <OpenOrderDialog 
        open={dialogOpen}
        table={selectedTable}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleOrderSuccess}
      />
    </Box>
  );
};

export default Dashboard;