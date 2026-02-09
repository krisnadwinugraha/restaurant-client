import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip, Avatar 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/axios';
import FoodFormDialog from '../components/FoodFormDialog';

const FoodMaster = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  const fetchFoods = async () => {
    const { data } = await api.get('/food');
    setFoods(data.data);
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleEdit = (food: any) => {
    setSelectedFood(food);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await api.delete(`/food/${id}`);
      fetchFoods();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Food Master</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => { setSelectedFood(null); setDialogOpen(true); }}
        >
          Add New Food
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foods.map((food) => (
              <TableRow key={food.id}>
                <TableCell>
                  <Avatar variant="rounded" src={food.image_url} alt={food.name} />
                </TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{food.name}</TableCell>
                <TableCell>
                  <Chip label={food.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">${food.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(food)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(food.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FoodFormDialog 
        open={dialogOpen} 
        food={selectedFood} 
        onClose={() => setDialogOpen(false)} 
        onSuccess={() => { setDialogOpen(false); fetchFoods(); }} 
      />
    </Box>
  );
};

export default FoodMaster;