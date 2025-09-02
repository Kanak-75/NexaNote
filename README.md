# Notion-like Calendar

A modern, feature-rich productivity application inspired by Notion, with comprehensive calendar functionality, task management, and note-taking capabilities.

## Features

### 📅 Calendar
- **Month View**: Full calendar month view with event display
- **Event Management**: Create, edit, and delete calendar events
- **Color Coding**: Customizable event colors for better organization
- **Date Navigation**: Easy month-to-month navigation
- **Event Details**: Rich event information with descriptions and time slots

### 📝 Notes
- **Rich Text Editing**: Create and edit notes with full text support
- **Tagging System**: Organize notes with custom tags
- **Search & Filter**: Find notes quickly with search functionality
- **Categories**: Group notes by categories
- **Grid Layout**: Beautiful card-based note display

### ✅ Tasks
- **Task Management**: Create, edit, and delete tasks
- **Priority Levels**: High, medium, and low priority options
- **Due Dates**: Set and track task deadlines
- **Status Tracking**: Mark tasks as completed or pending
- **Filtering**: Filter by priority, status, and search terms
- **Categories & Tags**: Organize tasks with categories and tags

### 📊 Dashboard
- **Overview Statistics**: Quick view of tasks, events, and notes
- **Progress Tracking**: Visual progress indicators
- **Today's Events**: See what's scheduled for today
- **Recent Activity**: Latest notes and upcoming events
- **Quick Actions**: Easy access to create new items

### 🎨 Modern UI
- **Material Design**: Clean, modern interface using Material-UI
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Customizable theme support
- **Smooth Animations**: Polished user experience
- **Intuitive Navigation**: Easy-to-use sidebar navigation

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Material-UI (MUI)**: Professional UI components
- **date-fns**: Modern date manipulation library
- **UUID**: Unique identifier generation
- **Local Storage**: Data persistence

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notion-like-calendar
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the application for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Usage

### Calendar
- Click on any date to create a new event
- Click on existing events to edit them
- Use the navigation arrows to move between months
- Events are color-coded and show time information

### Notes
- Click the "+" button to create a new note
- Click on any note card to edit it
- Use the search bar to find specific notes
- Add tags by typing and pressing Enter

### Tasks
- Click the "+" button to create a new task
- Click on any task to edit its details
- Use checkboxes to mark tasks as complete
- Filter tasks by priority, status, or search terms

### Dashboard
- View overview statistics and recent activity
- Click on items to navigate to their respective sections
- Quick access to create new items

## Data Persistence

All data is stored locally in your browser's localStorage, so your information persists between sessions. No external database or cloud storage is required.

## Customization

The application uses Material-UI theming, making it easy to customize colors, fonts, and other visual elements. Modify the theme object in `src/App.tsx` to change the appearance.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Future Enhancements

- [ ] Drag and drop functionality for tasks
- [ ] Calendar week and day views
- [ ] Export/import functionality
- [ ] Cloud synchronization
- [ ] Collaborative features
- [ ] Advanced search and filtering
- [ ] Custom themes and branding
- [ ] Mobile app version