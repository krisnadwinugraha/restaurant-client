import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface Props {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Notification = ({ open, message, severity, onClose }: Props) => (
  <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;