import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Palette,
  Notifications,
  Security,
  Backup,
  Delete,
  Info,
  Close,
} from '@mui/icons-material';

interface SettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  darkMode,
  onToggleDarkMode,
  onClose,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAllData = () => {
    localStorage.clear();
    window.location.reload();
    setIsDeleteDialogOpen(false);
  };

  const handleExportData = () => {
    const data = {
      tasks: localStorage.getItem('tasks'),
      notes: localStorage.getItem('notes'),
      events: localStorage.getItem('events'),
      darkMode: localStorage.getItem('darkMode'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notion-calendar-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ 
      p: 4, 
      height: '100%', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            flex: 1, 
            fontWeight: 700, 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}
        >
          Settings
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            color: 'white', 
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease',
            ml: 2
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <Paper 
        elevation={8} 
        sx={{ 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          p: 3
        }}
      >
        <List>
          <ListItem>
            <ListItemIcon>
              <Palette />
            </ListItemIcon>
            <ListItemText
              primary="Dark Mode"
              secondary="Switch between light and dark themes"
            />
            <Switch
              checked={darkMode}
              onChange={onToggleDarkMode}
              color="primary"
            />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText
              primary="Notifications"
              secondary="Enable desktop notifications for events and tasks"
            />
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              color="primary"
            />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <Backup />
            </ListItemIcon>
            <ListItemText
              primary="Auto Backup"
              secondary="Automatically backup your data"
            />
            <Switch
              checked={autoBackup}
              onChange={(e) => setAutoBackup(e.target.checked)}
              color="primary"
            />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <Security />
            </ListItemIcon>
            <ListItemText
              primary="Data Management"
              secondary="Export or delete your data"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleExportData}
              >
                Export
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete All
              </Button>
            </Box>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText
              primary="About"
              secondary="Notion-like Calendar v1.0.0"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete All Data</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all your data? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAllData} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
