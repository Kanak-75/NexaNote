import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  Close,
  Star,
} from '@mui/icons-material';

interface QuickNote {
  id: string;
  text: string;
  createdAt: Date;
  isStarred: boolean;
}

interface QuickNotesProps {
  onClose: () => void;
}

const QuickNotes: React.FC<QuickNotesProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem('quickNotes');
    return saved ? JSON.parse(saved).map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt)
    })) : [];
  });
  const [newNote, setNewNote] = useState('');

  const saveNotes = (updatedNotes: QuickNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('quickNotes', JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: QuickNote = {
        id: Date.now().toString(),
        text: newNote.trim(),
        createdAt: new Date(),
        isStarred: false,
      };
      saveNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
  };

  const handleToggleStar = (id: string) => {
    saveNotes(notes.map(note => 
      note.id === id ? { ...note, isStarred: !note.isStarred } : note
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

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
          Quick Notes
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
          p: 3,
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Add a quick note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            sx={{ minWidth: 100 }}
          >
            Add
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Press Enter to add, Shift+Enter for new line
        </Typography>
      </Paper>

      <Paper 
        elevation={8} 
        sx={{ 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          maxHeight: '60vh',
          overflow: 'auto'
        }}
      >
        <List>
          {sortedNotes.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No quick notes yet"
                secondary="Add your first quick note above"
                sx={{ textAlign: 'center' }}
              />
            </ListItem>
          ) : (
            sortedNotes.map((note) => (
              <ListItem key={note.id} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {note.text}
                      {note.isStarred && (
                        <Chip
                          icon={<Star />}
                          label="Starred"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={formatDate(note.createdAt)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleToggleStar(note.id)}
                    sx={{ mr: 1 }}
                  >
                    <Star 
                      sx={{ 
                        color: note.isStarred ? '#ff9800' : '#ccc',
                        fontSize: 20 
                      }} 
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteNote(note.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default QuickNotes;
