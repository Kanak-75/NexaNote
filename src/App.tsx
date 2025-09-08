import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Notes from './components/Notes';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import QuickNotes from './components/QuickNotes';
import { Task, Note, CalendarEvent, SidebarItem } from './types';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e7ad99', // warm blush accent
    },
    secondary: {
      main: '#b0c4b1', // sage
    },
    background: {
      default: '#cce3de', // soft mint canvas
      paper: '#ffffff',
    },
    divider: '#ecc8af',
    text: {
      primary: '#242423',
      secondary: '#895737',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e7ad99',
    },
    secondary: {
      main: '#b0c4b1',
    },
    background: {
      default: '#242423',
      paper: '#2e2e2e',
    },
    divider: '#895737',
    text: {
      primary: '#cce3de',
      secondary: '#b0c4b1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showQuickNotes, setShowQuickNotes] = useState<boolean>(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedNotes = localStorage.getItem('notes');
    const savedEvents = localStorage.getItem('events');
    const savedTheme = localStorage.getItem('darkMode');

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        date: new Date(task.date),
      })));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      })));
    }
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      })));
    }
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSidebarItemClick = (item: SidebarItem) => {
    setCurrentView(item.id);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleQuickNotesClick = () => {
    setShowQuickNotes(true);
  };

  // Task handlers
  const handleTaskAdd = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleTaskEdit = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Note handlers
  const handleNoteAdd = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newNote: Note = {
      ...noteData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes([...notes, newNote]);
  };

  const handleNoteEdit = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  const handleNoteDelete = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  // Event handlers
  const handleEventAdd = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: uuidv4(),
    };
    setEvents([...events, newEvent]);
  };

  const handleEventEdit = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            notes={notes}
            events={events}
            onTaskClick={(task) => setCurrentView('tasks')}
            onNoteClick={(note) => setCurrentView('notes')}
            onEventClick={(event) => setCurrentView('calendar')}
          />
        );
      case 'calendar':
        return (
          <Calendar
            events={events}
            onEventAdd={handleEventAdd}
            onEventEdit={handleEventEdit}
            onEventDelete={handleEventDelete}
          />
        );
      case 'notes':
        return (
          <Notes
            notes={notes}
            onNoteAdd={handleNoteAdd}
            onNoteEdit={handleNoteEdit}
            onNoteDelete={handleNoteDelete}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      case 'tasks':
        return (
          <Tasks
            tasks={tasks}
            onTaskAdd={handleTaskAdd}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskToggle={handleTaskToggle}
          />
        );
      default:
        return (
          <Dashboard
            tasks={tasks}
            notes={notes}
            events={events}
            onTaskClick={(task) => setCurrentView('tasks')}
            onNoteClick={(note) => setCurrentView('notes')}
            onEventClick={(event) => setCurrentView('calendar')}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          open={true}
          onClose={() => {}}
          onItemClick={handleSidebarItemClick}
          darkMode={darkMode}
          onSettingsClick={handleSettingsClick}
          onQuickNotesClick={handleQuickNotesClick}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: 'background.default',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Theme Toggle Button - Only show when not in notes view */}
          {currentView !== 'notes' && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 1000,
              }}
            >
              <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton
                  onClick={toggleDarkMode}
                  sx={{
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
            </Box>
          )}
          
          {/* Render current view or modals */}
          {showSettings ? (
            <Settings
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              onClose={() => setShowSettings(false)}
            />
          ) : showQuickNotes ? (
            <QuickNotes onClose={() => setShowQuickNotes(false)} />
          ) : (
            renderCurrentView()
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
