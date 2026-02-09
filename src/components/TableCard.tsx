import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { TableRestaurant, Lock, PlayArrow } from '@mui/icons-material';

interface Table {
  id: number;
  table_number: number;
  status: 'available' | 'occupied';
  is_available: boolean;
}

interface TableCardProps {
  table: Table;
  onOpenOrder: (tableId: number) => void;
}

const TableCard = ({ table, onOpenOrder }: TableCardProps) => {
  const isAvailable = table.status === 'available';

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderTop: 5,
      borderColor: isAvailable ? 'success.main' : 'error.main'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TableRestaurant color={isAvailable ? 'success' : 'error'} />
          <Chip 
            label={table.status.toUpperCase()} 
            size="small" 
            color={isAvailable ? 'success' : 'error'} 
          />
        </Box>
        
        <Typography variant="h5" component="div" gutterBottom>
          Table {table.table_number}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {isAvailable ? 'Ready for new customers' : 'Currently in service'}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button 
          fullWidth 
          variant="contained" 
          color={isAvailable ? 'primary' : 'inherit'}
          disabled={!isAvailable}
          startIcon={isAvailable ? <PlayArrow /> : <Lock />}
          onClick={() => onOpenOrder(table.id)}
        >
          {isAvailable ? 'Open Order' : 'Occupied'}
        </Button>
      </Box>
    </Card>
  );
};

export default TableCard;