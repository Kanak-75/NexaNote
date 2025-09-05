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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Sort,
  FilterList,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { Note } from '../types';

interface NotesProps {
  notes: Note[];
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onNoteEdit: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Notes: React.FC<NotesProps> = ({
  notes,
  onNoteAdd,
  onNoteEdit,
  onNoteDelete,
  darkMode,
  onToggleDarkMode,
}) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    category: '',
  });

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags,
      category: note.category || '',
    });
    setIsDialogOpen(true);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setNoteForm({
      title: '',
      content: '',
      tags: [],
      category: '',
    });
    setIsDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      onNoteEdit({
        ...selectedNote,
        ...noteForm,
        updatedAt: new Date(),
      });
    } else {
      onNoteAdd(noteForm);
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedNote(null);
    setNoteForm({
      title: '',
      content: '',
      tags: [],
      category: '',
    });
  };

  const handleDeleteNote = () => {
    if (selectedNote) {
      onNoteDelete(selectedNote.id);
      handleCloseDialog();
    }
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      const newTag = event.currentTarget.value.trim();
      if (!noteForm.tags.includes(newTag)) {
        setNoteForm({
          ...noteForm,
          tags: [...noteForm.tags, newTag],
        });
      }
      event.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNoteForm({
      ...noteForm,
      tags: noteForm.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Box sx={{ 
      p: 3, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'background.default',
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            flex: 1, 
            fontWeight: 600, 
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          Notes
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={onToggleDarkMode}
            sx={{ 
              backgroundColor: 'background.paper',
              color: 'text.primary',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { 
                backgroundColor: 'action.hover',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease',
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton 
            onClick={handleNewNote} 
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
              borderRadius: 2,
            }
          }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <IconButton sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': { 
            backgroundColor: 'action.hover',
            transform: 'scale(1.05)'
          }
        }}>
          <Sort />
        </IconButton>
        <IconButton sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': { 
            backgroundColor: 'action.hover',
            transform: 'scale(1.05)'
          }
        }}>
          <FilterList />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Grid container spacing={2}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => handleNoteClick(note)}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {note.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {note.content}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {note.tags.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {note.tags.length > 3 && (
                    <Chip
                      label={`+${note.tags.length - 3}`}
                      size="small"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {formatDate(note.updatedAt)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Note Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedNote ? 'Edit Note' : 'New Note'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Content"
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              multiline
              rows={8}
              fullWidth
            />
            <TextField
              label="Category"
              value={noteForm.category}
              onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
              fullWidth
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Tags (press Enter to add)
              </Typography>
              <TextField
                placeholder="Add a tag..."
                onKeyPress={handleTagInput}
                fullWidth
                size="small"
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {noteForm.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedNote && (
            <Button onClick={handleDeleteNote} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained">
            {selectedNote ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;
