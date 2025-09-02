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
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Sort,
  FilterList,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskToggle: (taskId: string) => void;
}

const Tasks: React.FC<TasksProps> = ({
  tasks,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete,
  onTaskToggle,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
    tags: [] as string[],
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      date: new Date(task.date).toISOString().split('T')[0],
      priority: task.priority,
      category: task.category || '',
      tags: task.tags,
    });
    setIsDialogOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setTaskForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
      category: '',
      tags: [],
    });
    setIsDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (selectedTask) {
      onTaskEdit({
        ...selectedTask,
        ...taskForm,
        date: new Date(taskForm.date),
      });
    } else {
      onTaskAdd({
        ...taskForm,
        date: new Date(taskForm.date),
        completed: false,
      });
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
    setTaskForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
      category: '',
      tags: [],
    });
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      onTaskDelete(selectedTask.id);
      handleCloseDialog();
    }
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      const newTag = event.currentTarget.value.trim();
      if (!taskForm.tags.includes(newTag)) {
        setTaskForm({
          ...taskForm,
          tags: [...taskForm.tags, newTag],
        });
      }
      event.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTaskForm({
      ...taskForm,
      tags: taskForm.tags.filter(tag => tag !== tagToRemove),
    });
  };

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flex: 1, fontWeight: 600 }}>
          Tasks
        </Typography>
        <IconButton onClick={handleNewTask} sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}>
          <Add />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Priority"
            onChange={(e: SelectChangeEvent) => setFilterPriority(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e: SelectChangeEvent) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <IconButton>
          <Sort />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Paper elevation={1}>
          <List>
            {filteredTasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <ListItem
                  button
                  onClick={() => handleTaskClick(task)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={task.completed}
                      onChange={(e) => {
                        e.stopPropagation();
                        onTaskToggle(task.id);
                      }}
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<CheckCircle />}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                          fontWeight: 500,
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {task.description && (
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {task.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(task.date)}
                          </Typography>
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(task.priority),
                              color: 'white',
                              fontSize: '0.7rem',
                            }}
                          />
                          {task.category && (
                            <Chip
                              label={task.category}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskDelete(task.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredTasks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Task Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Due Date"
              type="date"
              value={taskForm.date}
              onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskForm.priority}
                label="Priority"
                onChange={(e: SelectChangeEvent) => setTaskForm({ ...taskForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Category"
              value={taskForm.category}
              onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
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
                {taskForm.tags.map((tag) => (
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
          {selectedTask && (
            <Button onClick={handleDeleteTask} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {selectedTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
