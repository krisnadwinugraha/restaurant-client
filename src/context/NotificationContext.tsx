import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertColor } from '@mui/material';
import Notification from '../components/Notification';

interface NotificationContextType {
  showNotification: (msg: string, sev?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showNotification = (msg: string, sev: AlertColor = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification 
        open={open} 
        message={message} 
        severity={severity as any} 
        onClose={handleClose} 
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};