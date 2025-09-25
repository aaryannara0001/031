import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Configuration - Dynamic based on environment
const getApiUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // For Android, prioritize WiFi connection over ADB forwarding
      // Most physical devices will use WiFi connection
      return 'http://192.168.1.27:8000/api/v1';
    } else if (Platform.OS === 'ios') {
      // iOS simulator - use localhost
      return 'http://localhost:8000/api/v1';
    } else {
      // Web or other platforms - use localhost
      return 'http://localhost:8000/api/v1';
    }
  } else {
    // Production mode - replace with your production API URL
    return 'https://your-production-api.com/api/v1';
  }
};

const API_BASE_URL = getApiUrl();

// Log the API URL for debugging
console.log('Using API Base URL:', API_BASE_URL);

// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'citizen' | 'fieldworker' | 'staff' | 'admin';
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'fieldworker' | 'staff' | 'admin';
  avatar?: string;
  points?: number;
  badge_count?: number;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'pothole' | 'streetlight' | 'garbage' | 'waterlogging' | 'other';
  urgency: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
  latitude: number;
  longitude: number;
  address: string;
  images: string[];
  audio_note?: string;
  tracking_id: string;
  reporter_id: string;
  assignee_id?: string;
  reported_at: string;
  updated_at: string;
  upvotes?: number;
  downvotes?: number;
  comments_count?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  latitude: number;
  longitude: number;
  address: string;
  category: string;
  images: string[];
  assigned_at: string;
  due_date: string;
  issue_id: string;
  assignee_id: string;
}

export interface Comment {
  id: string;
  text: string;
  author_id: string;
  issue_id: string;
  created_at: string;
  author_name?: string;
}

// API Client Class with fallback URL support
class ApiClient {
  private baseURL: string;
  private fallbackURLs: string[];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Set up fallback URLs based on platform
    if (Platform.OS === 'android') {
      this.fallbackURLs = [
        'http://192.168.1.27:8000/api/v1', // WiFi connection
        'http://10.0.2.2:8000/api/v1', // ADB forwarding
        'http://localhost:8000/api/v1', // Last resort
      ];
    } else {
      this.fallbackURLs = [baseURL];
    }
    console.log('API Client initialized with URL:', baseURL);
    console.log('Fallback URLs:', this.fallbackURLs);
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: 'Unknown error' }));
      console.error('API Error:', response.status, errorData);
      return {
        error:
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data };
  }

  private async tryFetch<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    // Try primary URL first
    const primaryUrl = `${this.baseURL}${endpoint}`;

    try {
      console.log('Trying primary URL:', primaryUrl);
      const response = await fetch(primaryUrl, options);
      const result = await this.handleResponse<T>(response);
      if (!result.error) {
        return result;
      }
      console.log('Primary URL failed:', result.error);
    } catch (error) {
      console.log('Primary URL network error:', error);
    }

    // Try fallback URLs
    for (const fallbackURL of this.fallbackURLs) {
      if (fallbackURL === this.baseURL) continue; // Skip primary URL

      const url = `${fallbackURL}${endpoint}`;
      try {
        console.log('Trying fallback URL:', url);
        const response = await fetch(url, options);
        const result = await this.handleResponse<T>(response);
        if (!result.error) {
          console.log('Successfully connected using fallback:', fallbackURL);
          // Update primary URL for future requests
          this.baseURL = fallbackURL;
          return result;
        }
        console.log('Fallback URL failed:', result.error);
      } catch (error) {
        console.log('Fallback URL network error:', error);
      }
    }

    return {
      error: `Network error: Could not connect to any server. Tried: ${[
        this.baseURL,
        ...this.fallbackURLs,
      ].join(', ')}`,
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    return this.tryFetch<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    return this.tryFetch<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    return this.tryFetch<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    return this.tryFetch<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginRequest
  ): Promise<ApiResponse<TokenResponse>> => {
    return apiClient.post<TokenResponse>('/auth/login', credentials);
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<User>> => {
    return apiClient.post<User>('/auth/register', userData);
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<ApiResponse<TokenResponse>> => {
    return apiClient.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
  },

  logout: async (): Promise<ApiResponse<any>> => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      return apiClient.post('/auth/logout', { refresh_token: refreshToken });
    }
    return { data: { message: 'Logged out locally' } };
  },
};

// Issues API
export const issuesAPI = {
  getIssues: async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    status?: string;
    urgency?: number;
    assigned_to_me?: boolean;
    reported_by_me?: boolean;
  }): Promise<ApiResponse<Issue[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get<Issue[]>(
      `/issues${queryString ? `?${queryString}` : ''}`
    );
  },

  getIssue: async (issueId: string): Promise<ApiResponse<Issue>> => {
    return apiClient.get<Issue>(`/issues/${issueId}`);
  },

  createIssue: async (issueData: {
    title: string;
    description: string;
    category: 'pothole' | 'streetlight' | 'garbage' | 'waterlogging' | 'other';
    urgency: number;
    latitude: number;
    longitude: number;
    address: string;
    images: string[];
    audio_note?: string;
  }): Promise<ApiResponse<Issue>> => {
    return apiClient.post<Issue>('/issues', issueData);
  },

  updateIssue: async (
    issueId: string,
    issueData: Partial<Issue>
  ): Promise<ApiResponse<Issue>> => {
    return apiClient.put<Issue>(`/issues/${issueId}`, issueData);
  },

  getIssueComments: async (
    issueId: string
  ): Promise<ApiResponse<Comment[]>> => {
    return apiClient.get<Comment[]>(`/issues/${issueId}/comments`);
  },

  addComment: async (
    issueId: string,
    commentData: { text: string }
  ): Promise<ApiResponse<Comment>> => {
    return apiClient.post<Comment>(`/issues/${issueId}/comments`, commentData);
  },

  voteIssue: async (
    issueId: string,
    voteData: { is_upvote: boolean }
  ): Promise<ApiResponse<any>> => {
    return apiClient.post(`/issues/${issueId}/vote`, voteData);
  },

  getIssueStats: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/issues/stats/overview');
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    priority?: string;
    assigned_to_me?: boolean;
  }): Promise<ApiResponse<Task[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get<Task[]>(
      `/tasks${queryString ? `?${queryString}` : ''}`
    );
  },

  getTask: async (taskId: string): Promise<ApiResponse<Task>> => {
    return apiClient.get<Task>(`/tasks/${taskId}`);
  },

  createTask: async (taskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    latitude: number;
    longitude: number;
    address: string;
    category: string;
    images: string[];
    due_date: string;
    issue_id: string;
    assignee_id: string;
  }): Promise<ApiResponse<Task>> => {
    return apiClient.post<Task>('/tasks', taskData);
  },

  updateTask: async (
    taskId: string,
    taskData: Partial<Task>
  ): Promise<ApiResponse<Task>> => {
    return apiClient.put<Task>(`/tasks/${taskId}`, taskData);
  },

  assignTask: async (
    taskId: string,
    assignmentData: {
      assignee_id: string;
      due_date: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
    }
  ): Promise<ApiResponse<Task>> => {
    return apiClient.post<Task>(`/tasks/${taskId}/assign`, assignmentData);
  },

  getTaskStats: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/tasks/stats/overview');
  },
};

// Users API
export const usersAPI = {
  getUsers: async (params?: {
    skip?: number;
    limit?: number;
    role?: string;
  }): Promise<ApiResponse<User[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return apiClient.get<User[]>(
      `/users${queryString ? `?${queryString}` : ''}`
    );
  },

  getUser: async (userId: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/users/${userId}`);
  },

  updateUser: async (
    userId: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`/users/${userId}`, userData);
  },

  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<any>> => {
    return apiClient.post('/auth/change-password', passwordData);
  },
};

// Health check
export const healthAPI = {
  checkHealth: async (): Promise<
    ApiResponse<{ status: string; version: string }>
  > => {
    return apiClient.get('/health');
  },
};

export default apiClient;
