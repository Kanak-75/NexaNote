import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Event,
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { CalendarEvent } from '../types';

interface CalendarProps {
  events: CalendarEvent[];
  onEventAdd: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventEdit: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onEventAdd,
  onEventEdit,
  onEventDelete,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    endTime: '10:00',
    allDay: false,
    color: '#1976d2',
  });

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startDate), date) ||
      (event.allDay && isSameDay(new Date(event.startDate), date))
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEventForm({
      ...eventForm,
      startDate: format(date, 'yyyy-MM-dd'),
      endDate: format(date, 'yyyy-MM-dd'),
    });
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
      startTime: format(new Date(event.startDate), 'HH:mm'),
      endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
      endTime: format(new Date(event.endDate), 'HH:mm'),
      allDay: event.allDay,
      color: event.color,
    });
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    const newEvent = {
      title: eventForm.title,
      description: eventForm.description,
      startDate: new Date(`${eventForm.startDate}T${eventForm.startTime}`),
      endDate: new Date(`${eventForm.endDate}T${eventForm.endTime}`),
      allDay: eventForm.allDay,
      color: eventForm.color,
    };

    if (editingEvent) {
      onEventEdit({ ...editingEvent, ...newEvent });
    } else {
      onEventAdd(newEvent);
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsEventDialogOpen(false);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endDate: format(new Date(), 'yyyy-MM-dd'),
      endTime: '10:00',
      allDay: false,
      color: '#1976d2',
    });
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      onEventDelete(editingEvent.id);
      handleCloseDialog();
    }
  };

  const colorOptions = [
    { value: '#1976d2', label: 'Blue' },
    { value: '#d32f2f', label: 'Red' },
    { value: '#388e3c', label: 'Green' },
    { value: '#f57c00', label: 'Orange' },
    { value: '#7b1fa2', label: 'Purple' },
    { value: '#c2185b', label: 'Pink' },
  ];

  return (
    <Box sx={{ 
      p: 3, 
      height: '100%', 
      backgroundColor: 'background.default',
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          sx={{ 
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': { 
              backgroundColor: 'action.hover',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Typography 
          variant="h4" 
          sx={{ 
            flex: 1, 
            textAlign: 'center', 
            fontWeight: 600, 
            color: 'text.primary'
          }}
        >
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          sx={{ 
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': { 
              backgroundColor: 'action.hover',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Grid container>
          {/* Day headers with dates */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
            const today = new Date();
            const weekStart = startOfWeek(today);
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + index);
            
            return (
              <Grid item xs key={day}>
                <Box
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
                    {day}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {format(dayDate, 'd')}
                  </Typography>
                </Box>
              </Grid>
            );
          })}

          {/* Calendar days */}
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <Grid item xs key={day.toISOString()}>
                <Box
                  sx={{
                    minHeight: 120,
                    p: 1.5,
                    borderBottom: '1px solid',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: isToday ? 'primary.light' : 'background.paper',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isToday ? 'primary.main' : 'action.hover',
                      transform: 'scale(1.01)',
                      zIndex: 1,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: isToday ? 700 : 500,
                        color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                        fontSize: isToday ? '1.2rem' : '1rem',
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        p: 0.5,
                        opacity: 0.6,
                        '&:hover': { 
                          opacity: 1,
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <Add sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {dayEvents.slice(0, 2).map((event) => (
                      <Chip
                        key={event.id}
                        label={event.title}
                        size="small"
                        sx={{
                          backgroundColor: event.color,
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20,
                          fontWeight: 400,
                          '&:hover': {
                            backgroundColor: event.color,
                            opacity: 0.9,
                          },
                          transition: 'all 0.2s ease',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.65rem',
                          textAlign: 'center',
                          opacity: 0.8
                        }}
                      >
                        +{dayEvents.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'New Event'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={eventForm.startDate}
                onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                fullWidth
              />
              {!eventForm.allDay && (
                <TextField
                  label="Start Time"
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  fullWidth
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="End Date"
                type="date"
                value={eventForm.endDate}
                onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                fullWidth
              />
              {!eventForm.allDay && (
                <TextField
                  label="End Time"
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  fullWidth
                />
              )}
            </Box>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={eventForm.color}
                label="Color"
                onChange={(e: SelectChangeEvent) => setEventForm({ ...eventForm, color: e.target.value })}
              >
                {colorOptions.map((color) => (
                  <MenuItem key={color.value} value={color.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: color.value,
                        }}
                      />
                      {color.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          {editingEvent && (
            <Button onClick={handleDeleteEvent} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEvent} variant="contained">
            {editingEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
