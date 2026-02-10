import React, { useEffect, useState, useCallback } from 'react';
import { 
  Grid, Typography, Box, Alert, Skeleton, Paper, TextField, InputAdornment, Divider, Stack 
} from '@mui/material';
import { 
  TableRestaurant, CheckCircle, RemoveCircle, Search as SearchIcon, FilterList 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; 
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TableCard from '../components/TableCard';
import OpenOrderDialog from '../components/OpenOrderDialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // Dialog State
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 1. Fetch Data
  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tables');
      setTables(data.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load tables.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  // 2. Case-Insensitive Search Logic
  const filteredTables = tables.filter(table => {
    const term = search.toLowerCase();
    const tableNum = table.table_number.toString().toLowerCase(); // Handles "T-01" vs "t-01"
    const status = table.status.toLowerCase();
    
    return tableNum.includes(term) || status.includes(term);
  });

  // 3. Dynamic Stats Calculation
  const stats = [
    { label: 'Total Tables', value: tables.length, icon: <TableRestaurant />, color: 'primary.main', bg: 'primary.light' },
    { label: 'Available', value: tables.filter(t => t.status === 'available').length, icon: <CheckCircle />, color: 'success.main', bg: '#e8f5e9' },
    { label: 'Occupied', value: tables.filter(t => t.status === 'occupied').length, icon: <RemoveCircle />, color: 'error.main', bg: '#ffebee' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">
          {user ? `Welcome back, ${user.name}` : 'Guest View Mode'}
        </Typography>
      </Box>

      {/* MAIN LAYOUT: 2 COLUMNS */}
      <Grid container spacing={3}>
        
        {/* LEFT COLUMN: Search & Table Grid (Width: 9/12) */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Search Bar */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'grey.300' }}>
            <TextField
              fullWidth
              placeholder="Search table (e.g., T-01)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'grey.50' } }}
            />
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* Table Grid */}
          <Grid container spacing={2}>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <Grid key={`skel-${i}`} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            ) : filteredTables.length > 0 ? (
              filteredTables.map((table) => (
                <Grid key={table.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <TableCard 
                    table={table} 
                    onOpenOrder={user ? () => { setSelectedTable(table); setDialogOpen(true); } : undefined} 
                  />
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary', bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography>No tables found matching "{search}"</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* RIGHT COLUMN: Fast Lookup Sidebar (Width: 3/12) */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: 'sticky', top: 80 }}> {/* Makes it stick while scrolling */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <FilterList color="action" />
                <Typography variant="h6" fontWeight="bold">Quick Stats</Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                {stats.map((stat) => (
                  <Box 
                    key={stat.label} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 }
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" textTransform="uppercase">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                        {loading ? '-' : stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: '50%', 
                      bgcolor: stat.bg, 
                      color: stat.color, 
                      display: 'flex' 
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Optional: Legend or Help Text */}
            <Box sx={{ mt: 2, px: 1 }}>
              <Typography variant="caption" color="text.secondary">
                * Green tables are ready for new customers. <br/>
                * Red tables are currently occupied.
              </Typography>
            </Box>
          </Box>
        </Grid>

      </Grid>

      <OpenOrderDialog 
        open={dialogOpen}
        table={selectedTable}
        onClose={() => setDialogOpen(false)}
        onSuccess={(id: number) => navigate(`/orders/${id}`)}
      />
    </Box>
  );
};

export default Dashboard;