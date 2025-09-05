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
}

const Notes: React.FC<NotesProps> = ({
  notes,
  onNoteAdd,
  onNoteEdit,
  onNoteDelete,
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
      p: 4, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
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
          Notes
        </Typography>
        <IconButton 
          onClick={handleNewNote} 
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
          <Add />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              }
            }
          }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <IconButton sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.2)', 
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
        }}>
          <Sort />
        </IconButton>
        <IconButton sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.2)', 
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
        }}>
          <FilterList />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Grid container spacing={2}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Paper
                elevation={8}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    elevation: 12,
                    transform: 'translateY(-8px) scale(1.02)',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
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
