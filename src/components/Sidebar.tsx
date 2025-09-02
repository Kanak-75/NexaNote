import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  Notes,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Add,
  Folder,
  Star,
  Settings,
} from '@mui/icons-material';
import { SidebarItem } from '../types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onItemClick: (item: SidebarItem) => void;
}

const defaultItems: SidebarItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    type: 'page',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: 'calendar',
    type: 'calendar',
  },
  {
    id: 'notes',
    title: 'Notes',
    icon: 'notes',
    type: 'notes',
  },
  {
    id: 'tasks',
    title: 'Tasks',
    icon: 'dashboard',
    type: 'database',
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'dashboard':
      return <Dashboard />;
    case 'calendar':
      return <CalendarToday />;
    case 'notes':
      return <Notes />;
    case 'folder':
      return <Folder />;
    case 'star':
      return <Star />;
    case 'settings':
      return <Settings />;
    default:
      return <Dashboard />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onItemClick }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else {
      onItemClick(item);
    }
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              px: 2.5,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getIcon(item.icon)}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
              }}
            />
            {hasChildren && (
              <IconButton size="small">
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: '#fafafa',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Notion-like Calendar
          </Typography>
        </Box>
        
        <List sx={{ pt: 1 }}>
          {defaultItems.map((item) => renderItem(item))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
            FAVORITES
          </Typography>
        </Box>
        
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Star sx={{ fontSize: 20, color: '#666' }} />
              </ListItemIcon>
              <ListItemText
                primary="Quick Notes"
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Settings sx={{ fontSize: 20, color: '#666' }} />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
