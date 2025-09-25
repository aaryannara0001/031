import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTheme } from '@/contexts/ThemeContext';
import { Task as ApiTask, tasksAPI } from '@/services/api';
import { getPriorityColor } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Task {
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

export default function TasksScreen() {
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    {
      id: 'new',
      label: 'New',
      count: tasks.filter((t) => t.status === 'new').length,
    },
    {
      id: 'accepted',
      label: 'Accepted',
      count: tasks.filter((t) => t.status === 'accepted').length,
    },
    { id: 'completed', label: 'Completed', count: 5 }, // Mock additional completed tasks
  ];

  const fetchTasks = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await tasksAPI.getTasks({ assigned_to_me: true });
      if (response.data) {
        // Convert API tasks to frontend format
        const convertedTasks: Task[] = response.data.map(
          (apiTask: ApiTask) => ({
            id: apiTask.id,
            issueId: apiTask.issue_id,
            title: apiTask.title,
            description: apiTask.description,
            priority: apiTask.priority,
            status:
              apiTask.status === 'in_progress' ? 'in-progress' : apiTask.status,
            assignedAt: new Date(apiTask.assigned_at),
            dueDate: new Date(apiTask.due_date),
            location: {
              latitude: apiTask.latitude,
              longitude: apiTask.longitude,
              address: apiTask.address,
            },
            category: apiTask.category,
            images: apiTask.images,
          })
        );
        setTasks(convertedTasks);
      } else if (response.error) {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks =
    selectedFilter === 'all'
      ? tasks
      : tasks.filter((task) => task.status === selectedFilter);

  const handleAcceptTask = async (taskId: string) => {
    try {
      const response = await tasksAPI.updateTask(taskId, {
        status: 'accepted',
      });
      if (response.data) {
        Alert.alert('Success', 'Task accepted successfully');
        fetchTasks(); // Refresh the list
      } else if (response.error) {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Failed to accept task:', error);
      Alert.alert('Error', 'Failed to accept task');
    }
  };

  const handleRejectTask = async (taskId: string) => {
    try {
      const response = await tasksAPI.updateTask(taskId, {
        status: 'rejected',
      });
      if (response.data) {
        Alert.alert('Success', 'Task rejected');
        fetchTasks(); // Refresh the list
      } else if (response.error) {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Failed to reject task:', error);
      Alert.alert('Error', 'Failed to reject task');
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return <AlertTriangle color={getPriorityColor(priority)} size={16} />;
      case 'medium':
        return <Clock color={getPriorityColor(priority)} size={16} />;
      case 'low':
        return <CheckCircle2 color={getPriorityColor(priority)} size={16} />;
      default:
        return <Clock color="#9CA3AF" size={16} />;
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading tasks...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            My Tasks
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Manage assigned work orders
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.filterHeaderButton,
            { backgroundColor: colors.surface },
          ]}
          onPress={() => fetchTasks(true)}
        >
          <RefreshCw color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                { backgroundColor: colors.surface, borderColor: colors.border },
                selectedFilter === filter.id && [
                  styles.filterTabActive,
                  { backgroundColor: colors.primary },
                ],
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.textSecondary },
                  selectedFilter === filter.id && [
                    styles.filterTextActive,
                    { color: colors.text },
                  ],
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterCount,
                  { backgroundColor: colors.surface },
                  selectedFilter === filter.id && [
                    styles.filterCountActive,
                    { backgroundColor: colors.text + '20' },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    { color: colors.text },
                    selectedFilter === filter.id && [
                      styles.filterCountTextActive,
                      { color: colors.primary },
                    ],
                  ]}
                >
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tasks List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchTasks(true)}
            tintColor={colors.primary}
          />
        }
      >
        {filteredTasks.length === 0 ? (
          <Card style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No tasks found
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {selectedFilter === 'all'
                ? 'No tasks have been assigned to you yet.'
                : `No ${selectedFilter} tasks found.`}
            </Text>
          </Card>
        ) : (
          filteredTasks.map((task, index) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/task-detail/${task.id}`)}
            >
              <Card style={[styles.taskCard, index === 0 && styles.firstCard]}>
                <View style={styles.taskHeader}>
                  <View style={styles.taskTitleRow}>
                    <View style={styles.priorityIndicator}>
                      {getPriorityIcon(task.priority)}
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(task.priority) },
                        ]}
                      >
                        {task.priority.toUpperCase()}
                      </Text>
                    </View>
                    <StatusBadge status={task.status} size="sm" />
                  </View>

                  <Text style={[styles.taskTitle, { color: colors.text }]}>
                    {task.title}
                  </Text>
                </View>

                <View style={styles.taskContent}>
                  <Image
                    source={{ uri: task.images[0] }}
                    style={styles.taskImage}
                  />

                  <View style={styles.taskDetails}>
                    <View style={styles.taskLocation}>
                      <MapPin color={colors.textSecondary} size={14} />
                      <Text
                        style={[
                          styles.taskLocationText,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={2}
                      >
                        {task.location.address}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.taskDescription,
                        { color: colors.textTertiary },
                      ]}
                      numberOfLines={3}
                    >
                      {task.description}
                    </Text>

                    <View style={styles.taskFooter}>
                      <View style={styles.taskMeta}>
                        <Text
                          style={[
                            styles.taskCategory,
                            { color: colors.primary },
                          ]}
                        >
                          {task.category}
                        </Text>
                        <View style={styles.taskDueDate}>
                          <Clock color={colors.warning} size={12} />
                          <Text
                            style={[
                              styles.taskDueDateText,
                              { color: colors.warning },
                            ]}
                          >
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      {task.status === 'new' && (
                        <View style={styles.quickActions}>
                          <TouchableOpacity
                            style={[
                              styles.quickActionBtn,
                              styles.acceptBtn,
                              { backgroundColor: colors.success },
                            ]}
                            onPress={() => handleAcceptTask(task.id)}
                          >
                            <Text
                              style={[
                                styles.quickActionText,
                                { color: colors.text },
                              ]}
                            >
                              Accept
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.quickActionBtn,
                              styles.rejectBtn,
                              { borderColor: colors.border },
                            ]}
                            onPress={() => handleRejectTask(task.id)}
                          >
                            <Text
                              style={[
                                styles.quickActionText,
                                { color: colors.textSecondary },
                              ]}
                            >
                              Reject
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View
                  style={[styles.taskId, { borderTopColor: colors.border }]}
                >
                  <Text style={[styles.taskIdText, { color: colors.primary }]}>
                    Task #{task.id.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.assignedDate,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Assigned {new Date(task.assignedAt).toLocaleDateString()}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  filterHeaderButton: {
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 8,
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#8B5CF6',
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: '#4B5563',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: '#FFFFFF20',
  },
  filterCountText: {
    color: '#F9FAFB',
    fontSize: 11,
    fontWeight: '600',
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#F9FAFB',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  taskCard: {
    marginBottom: 12,
  },
  firstCard: {
    marginTop: 0,
  },
  taskHeader: {
    marginBottom: 12,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    lineHeight: 22,
  },
  taskContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  taskImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskLocationText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    flex: 1,
    lineHeight: 16,
  },
  taskDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'column',
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCategory: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  taskDueDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDueDateText: {
    fontSize: 11,
    color: '#F59E0B',
    marginLeft: 4,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  taskId: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 8,
    marginTop: 4,
  },
  taskIdText: {
    fontSize: 11,
    color: '#8B5CF6',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  assignedDate: {
    fontSize: 10,
    color: '#6B7280',
  },
});
