export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  category?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  color: string;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  type: 'page' | 'database' | 'calendar' | 'notes';
  children?: SidebarItem[];
}

export interface EmailScheduleRequest {
  senderEmail?: string;
  senderPassword?: string;
  receiverEmail: string;
  subject?: string;
  body?: string;
  runAtIso: string;
}