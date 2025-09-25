import { Issue, Task } from '@/types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Dangerous pothole causing vehicle damage near the intersection with Oak Avenue.',
    category: 'pothole',
    urgency: 4,
    status: 'assigned',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Main Street, San Francisco, CA',
    },
    images: ['https://images.pexels.com/photos/163016/highway-asphalt-space-sky-163016.jpeg?w=400'],
    reportedBy: '1',
    assignedTo: '2',
    reportedAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z'),
    upvotes: 23,
    downvotes: 2,
    comments: [
      {
        id: '1',
        text: 'This has been getting worse every week!',
        author: '5',
        authorName: 'Local Resident',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      }
    ],
    trackingId: 'TRK-2024-001',
  },
  {
    id: '2',
    title: 'Broken street light',
    description: 'Street light has been flickering and now completely dark. Safety concern for pedestrians.',
    category: 'streetlight',
    urgency: 3,
    status: 'pending',
    location: {
      latitude: 37.7849,
      longitude: -122.4094,
      address: '456 Oak Avenue, San Francisco, CA',
    },
    images: ['https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg?w=400'],
    reportedBy: '1',
    reportedAt: new Date('2024-01-16T08:15:00Z'),
    updatedAt: new Date('2024-01-16T08:15:00Z'),
    upvotes: 8,
    downvotes: 0,
    comments: [],
    trackingId: 'TRK-2024-002',
  },
  {
    id: '3',
    title: 'Overflowing garbage bin',
    description: 'Public trash bin is overflowing and attracting pests. Needs immediate attention.',
    category: 'garbage',
    urgency: 2,
    status: 'resolved',
    location: {
      latitude: 37.7649,
      longitude: -122.4294,
      address: '789 Pine Street, San Francisco, CA',
    },
    images: ['https://images.pexels.com/photos/2827735/pexels-photo-2827735.jpeg?w=400'],
    reportedBy: '1',
    assignedTo: '2',
    reportedAt: new Date('2024-01-14T16:45:00Z'),
    updatedAt: new Date('2024-01-15T09:30:00Z'),
    upvotes: 12,
    downvotes: 1,
    comments: [
      {
        id: '2',
        text: 'Thank you for the quick response!',
        author: '1',
        authorName: 'John Citizen',
        createdAt: new Date('2024-01-15T10:00:00Z'),
      }
    ],
    trackingId: 'TRK-2024-003',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    issueId: '1',
    title: 'Repair pothole on Main Street',
    description: 'Large pothole causing vehicle damage. Requires immediate patching.',
    priority: 'high',
    status: 'accepted',
    assignedAt: new Date('2024-01-15T14:20:00Z'),
    dueDate: new Date('2024-01-17T17:00:00Z'),
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Main Street, San Francisco, CA',
    },
    category: 'Pothole',
    images: ['https://images.pexels.com/photos/163016/highway-asphalt-space-sky-163016.jpeg?w=400'],
  },
  {
    id: '2',
    issueId: '4',
    title: 'Clear waterlogged area',
    description: 'Water accumulation after recent rain. Check drainage system.',
    priority: 'medium',
    status: 'new',
    assignedAt: new Date('2024-01-16T09:00:00Z'),
    dueDate: new Date('2024-01-18T17:00:00Z'),
    location: {
      latitude: 37.7549,
      longitude: -122.4394,
      address: '321 Elm Street, San Francisco, CA',
    },
    category: 'Waterlogging',
    images: ['https://images.pexels.com/photos/1029233/pexels-photo-1029233.jpeg?w=400'],
  },
];

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    pothole: '#EF4444',
    streetlight: '#F59E0B',
    garbage: '#10B981',
    waterlogging: '#3B82F6',
    other: '#6B7280',
  };
  return colors[category] || colors.other;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#F59E0B',
    assigned: '#3B82F6',
    'in-progress': '#8B5CF6',
    resolved: '#10B981',
    rejected: '#EF4444',
    new: '#F59E0B',
    accepted: '#3B82F6',
    completed: '#10B981',
  };
  return colors[status] || '#6B7280';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#DC2626',
  };
  return colors[priority] || '#6B7280';
};