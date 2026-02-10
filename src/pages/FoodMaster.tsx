import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip, Avatar 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/axios';
import FoodFormDialog from '../components/FoodFormDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const FoodMaster = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFoods = async () => {
    try {
      const { data } = await api.get('/food');
      setFoods(data.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleEdit = (food: any) => {
    setSelectedFood(food);
    setDialogOpen(true);
  };

  const handleDeleteClick = (food: any) => {
    setItemToDelete(food);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/food/${itemToDelete.id}`);
      setDeleteDialogOpen(false);
      fetchFoods();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const getImageSrc = (food: any) => {
    const fallbackImage = food.category === 'drink' 
      ? '/images/default-drink.jpg' 
      : '/images/default-food.jpg';
    
    return food.image_url || fallbackImage;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, category: string) => {
    const fallbackImage = category === 'drink' 
      ? '/images/default-drink.jpg' 
      : '/images/default-food.jpg';
    e.currentTarget.src = fallbackImage;
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
                  <Avatar 
                    variant="rounded" 
                    src={getImageSrc(food)} 
                    alt={food.name}
                    imgProps={{
                      onError: (e: React.SyntheticEvent<HTMLImageElement>) => 
                        handleImageError(e, food.category)
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{food.name}</TableCell>
                <TableCell>
                  <Chip label={food.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">${Number(food.price).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(food)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(food)} color="error">
                    <DeleteIcon />
                  </IconButton>
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

      <DeleteConfirmDialog 
        open={deleteDialogOpen}
        title={itemToDelete?.name || ''}
        loading={isDeleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default FoodMaster;