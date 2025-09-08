import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  IconButton,
  Button,
} from '@mui/material';
import {
  Event,
  Notes,
  CheckCircle,
  Schedule,
  TrendingUp,
  Add,
} from '@mui/icons-material';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { Task, Note, CalendarEvent } from '../types';

interface DashboardProps {
  tasks: Task[];
  notes: Note[];
  events: CalendarEvent[];
  onTaskClick: (task: Task) => void;
  onNoteClick: (note: Note) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  notes,
  events,
  onTaskClick,
  onNoteClick,
  onEventClick,
}) => {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const todayEvents = events.filter(event => 
    isToday(new Date(event.startDate)) || 
    isToday(new Date(event.endDate))
  );
  const upcomingEvents = events.filter(event => 
    new Date(event.startDate) > new Date() && 
    !isToday(new Date(event.startDate))
  ).slice(0, 5);
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#d32f2f';
      case 'medium':
        return '#f57c00';
      case 'low':
        return '#388e3c';
      default:
        return '#666';
    }
  };

  const formatEventTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };

  const formatEventDate = (date: Date) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    if (isThisWeek(eventDate)) return format(eventDate, 'EEEE');
    return format(eventDate, 'MMM d');
  };

  return (
    <Box sx={{ 
      p: 3, 
      height: '100%', 
      overflow: 'auto',
      backgroundColor: 'background.default'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 2, 
          fontWeight: 700, 
          color: 'text.primary',
          textAlign: 'center',
          fontFamily: 'Quicksand, Roboto, Helvetica, Arial, sans-serif'
        }}
      >
        🎀 NexaNote
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 3 }}>
        <Button variant="contained" color="secondary" onClick={() => onEventClick && onEventClick({} as any)} sx={{ textTransform: 'none' }}>
          Go to Calendar
        </Button>
        <Button variant="outlined" onClick={() => onNoteClick && onNoteClick({} as any)} sx={{ textTransform: 'none' }}>
          Open Notes
        </Button>
        <Button variant="outlined" onClick={() => onTaskClick && onTaskClick({} as any)} sx={{ textTransform: 'none' }}>
          View Tasks
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ color: 'primary.main', mr: 1, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Tasks</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                {tasks.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {completedTasks.length} completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}
                sx={{ 
                  mt: 2, 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'primary.main'
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ color: 'secondary.main', mr: 1, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Events</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                {events.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {todayEvents.length} today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notes sx={{ color: 'primary.main', mr: 1, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Notes</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                {notes.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {recentNotes.length} recent
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ color: 'secondary.main', mr: 1, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Progress</Typography>
              </Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Task completion
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Events */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Today's Events</Typography>
                <IconButton size="small">
                  <Add />
                </IconButton>
              </Box>
              {todayEvents.length > 0 ? (
                <List dense>
                  {todayEvents.map((event) => (
                    <ListItem
                      key={event.id}
                      button
                      onClick={() => onEventClick(event)}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: event.color,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={`${formatEventTime(event.startDate)} - ${formatEventTime(event.endDate)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No events scheduled for today
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Pending Tasks</Typography>
                <IconButton size="small">
                  <Add />
                </IconButton>
              </Box>
              {pendingTasks.length > 0 ? (
                <List dense>
                  {pendingTasks.slice(0, 5).map((task) => (
                    <ListItem
                      key={task.id}
                      button
                      onClick={() => onTaskClick(task)}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: getPriorityColor(task.priority),
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={format(new Date(task.date), 'MMM d, yyyy')}
                      />
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No pending tasks
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upcoming Events
              </Typography>
              {upcomingEvents.length > 0 ? (
                <List dense>
                  {upcomingEvents.map((event) => (
                    <ListItem
                      key={event.id}
                      button
                      onClick={() => onEventClick(event)}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: event.color,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={`${formatEventDate(event.startDate)} at ${formatEventTime(event.startDate)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No upcoming events
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Notes */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Notes
              </Typography>
              {recentNotes.length > 0 ? (
                <List dense>
                  {recentNotes.map((note) => (
                    <ListItem
                      key={note.id}
                      button
                      onClick={() => onNoteClick(note)}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon>
                        <Notes sx={{ color: '#7b1fa2' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={note.title}
                        secondary={format(new Date(note.updatedAt), 'MMM d, yyyy')}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No notes yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
