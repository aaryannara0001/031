export type UserRole = 'citizen' | 'fieldworker' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  points?: number;
  badgeCount?: number;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'pothole' | 'streetlight' | 'garbage' | 'waterlogging' | 'other';
  urgency: number; // 1-5 scale
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'rejected';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  audioNote?: string;
  reportedBy: string;
  assignedTo?: string;
  reportedAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  trackingId: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorName: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  issueId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'accepted' | 'in-progress' | 'completed' | 'rejected';
  assignedAt: Date;
  dueDate: Date;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  category: string;
  images: string[];
}