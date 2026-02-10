import React, { useState } from 'react';
import { 
  Container, Box, Typography, TextField, Button, Alert, Paper, Stack, Divider 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack as BackIcon, 
  RestaurantMenu as LogoIcon,
  Person as PersonIcon 
} from '@mui/icons-material';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper for Demo Login
  const handleQuickLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password');
    // We use a small timeout to ensure state updates before submission
    // or we can just call login directly with the values
    performLogin(roleEmail, 'password');
  };

  const performLogin = async (eEmail: string, pPass: string) => {
    setError(null);
    setLoading(true);
    try {
      await login({ email: eEmail, password: pPass });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Box sx={{ p: 2 }}>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => navigate('/')}
          sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 'bold' }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Container maxWidth="xs" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, width: '100%', borderRadius: 4, border: '1px solid', 
              borderColor: 'grey.200', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <LogoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>

            <Typography variant="h5" align="center" fontWeight="bold">
              RESTO<span style={{ color: '#1976d2' }}>API</span>
            </Typography>
            
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
              Enter your credentials to access staff features
            </Typography>

            {/* DEMO BUTTONS SECTION */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                size="small"
                startIcon={<PersonIcon />}
                onClick={() => handleQuickLogin('waiter@restaurant.com')}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                As Waiter
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                size="small"
                startIcon={<PersonIcon />}
                onClick={() => handleQuickLogin('cashier@restaurant.com')}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                As Cashier
              </Button>
            </Stack>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.disabled">OR LOG IN MANUALLY</Typography>
            </Divider>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email Address"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="small"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="small"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 1, py: 1.5, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>
          </Paper>
          
          <Typography variant="caption" color="text.disabled" sx={{ mt: 3 }}>
            &copy; 2026 RestoAPI Management System
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;