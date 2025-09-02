import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Notes from './components/Notes';
import Tasks from './components/Tasks';
import { Task, Note, CalendarEvent, SidebarItem } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
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
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedNotes = localStorage.getItem('notes');
    const savedEvents = localStorage.getItem('events');

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

  const handleSidebarItemClick = (item: SidebarItem) => {
    setCurrentView(item.id);
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          open={true}
          onClose={() => {}}
          onItemClick={handleSidebarItemClick}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#fafafa',
            overflow: 'hidden',
          }}
        >
          {renderCurrentView()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
