import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, Typography, Button, Container, 
  Avatar, Menu, MenuItem, IconButton, Stack, useMediaQuery, useTheme
} from '@mui/material';
import {
  RestaurantMenu as LogoIcon,
  Dashboard as DashboardIcon,
  Restaurant as FoodIcon,
  Receipt as OrderIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Dropdown Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Define Navigation Items
  const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon sx={{ mr: 1 }} />, roles: ['public'] },
  { label: 'Food Master', path: '/food', icon: <FoodIcon sx={{ mr: 1 }} />, roles: ['admin', 'waiter'] },
  { label: 'Orders', path: '/orders', icon: <OrderIcon sx={{ mr: 1 }} />, roles: ['admin', 'waiter', 'cashier'] },
];

 const visibleItems = navItems.filter(item => {
    if (item.roles.includes('public')) return true;
    if (!user || !user.roles) return false;
    return item.roles.some(role => user.roles.includes(role));
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* 1. TOP NAVIGATION BAR */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* LOGO SECTION */}
            <LogoIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => navigate('/')}
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'text.primary',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              RESTO<span style={{ color: '#1976d2' }}>API</span>
            </Typography>

            {/* DESKTOP MENU LINKS */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {visibleItems.map((page) => {
                const isActive = location.pathname === page.path;
                return (
                  <Button
                    key={page.label}
                    onClick={() => navigate(page.path)}
                    startIcon={page.icon}
                    sx={{
                      my: 2,
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 'bold' : 'medium',
                      bgcolor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)', color: 'primary.main' },
                      px: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.95rem'
                    }}
                  >
                    {page.label}
                  </Button>
                );
              })}
            </Box>

            {/* USER SECTION (RIGHT SIDE) */}
            <Box sx={{ flexGrow: 0 }}>
              {user ? (
                <>
                  <Button 
                    onClick={handleMenuOpen} 
                    sx={{ p: 0.5, borderRadius: 3, textTransform: 'none' }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="body2" color="text.primary" fontWeight="bold">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'capitalize' }}>
                          {user.role}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: '1rem' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Stack>
                  </Button>
                  
                  {/* DROPDOWN MENU */}
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: { width: 200, borderRadius: 2, mt: 1 }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1, display: { sm: 'none' } }}>
                       <Typography variant="subtitle2">{user.name}</Typography>
                       <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                    </Box>
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/login')}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Staff Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 2. MAIN CONTENT AREA */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;