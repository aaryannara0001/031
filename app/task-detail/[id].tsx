import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTheme } from '@/contexts/ThemeContext';
import { tasksAPI } from '@/services/api';
import { getPriorityColor } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Camera,
  CheckCircle,
  ChevronLeft,
  Clock,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  User,
  XCircle,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
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

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTask = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const response = await tasksAPI.getTask(id);
      if (response.data) {
        // Convert API task to frontend format
        const apiTask = response.data;
        const convertedTask: Task = {
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
        };
        setTask(convertedTask);
      } else if (response.error) {
        Alert.alert('Error', response.error);
        router.back();
      }
    } catch (error) {
      console.error('Failed to fetch task:', error);
      Alert.alert('Error', 'Failed to load task details');
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleAcceptTask = async () => {
    if (!task) return;

    try {
      setActionLoading(true);
      const response = await tasksAPI.updateTask(task.id, {
        status: 'accepted',
      });
      if (response.data) {
        Alert.alert('Success', 'Task accepted successfully!');
        fetchTask(); // Refresh task data
      } else if (response.error) {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Failed to accept task:', error);
      Alert.alert('Error', 'Failed to accept task. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectTask = async () => {
    if (!task) return;

    Alert.alert('Reject Task', 'Are you sure you want to reject this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            setActionLoading(true);
            const response = await tasksAPI.updateTask(task.id, {
              status: 'rejected',
            });
            if (response.data) {
              Alert.alert(
                'Task Rejected',
                'The task has been rejected and reassigned.'
              );
              router.back();
            } else if (response.error) {
              Alert.alert('Error', response.error);
            }
          } catch (error) {
            console.error('Failed to reject task:', error);
            Alert.alert('Error', 'Failed to reject task. Please try again.');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const handleCompleteTask = async () => {
    if (!task) return;

    Alert.alert('Complete Task', 'Mark this task as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: async () => {
          try {
            setActionLoading(true);
            const response = await tasksAPI.updateTask(task.id, {
              status: 'completed',
            });
            if (response.data) {
              Alert.alert('Success', 'Task marked as completed!');
              router.back();
            } else if (response.error) {
              Alert.alert('Error', response.error);
            }
          } catch (error) {
            console.error('Failed to complete task:', error);
            Alert.alert('Error', 'Failed to complete task. Please try again.');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const handleCallContact = () => {
    Alert.alert('Call', 'Calling contact person...');
  };

  const handleNavigate = () => {
    Alert.alert('Navigation', 'Opening navigation to task location...');
  };

  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Photo upload functionality coming soon!');
  };

  const handleAddNote = () => {
    Alert.alert('Add Note', 'Note functionality coming soon!');
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading task details...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (!task) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Task Not Found
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            The task you&apos;re looking for doesn&apos;t exist.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const isNewTask = task.status === 'new';

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <ChevronLeft color={colors.textSecondary} size={24} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          Task Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Task Card */}
        <Card style={styles.mainCard}>
          {/* Priority and Status */}
          <View style={styles.headerRow}>
            <View style={styles.priorityBadge}>
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(task.priority) },
                ]}
              />
              <Text style={[styles.priorityText, { color: colors.text }]}>
                {task.priority.toUpperCase()} PRIORITY
              </Text>
            </View>
            <StatusBadge status={task.status} />
          </View>

          {/* Title */}
          <Text style={[styles.taskTitle, { color: colors.text }]}>
            {task.title}
          </Text>

          {/* Description */}
          <Text
            style={[styles.taskDescription, { color: colors.textSecondary }]}
          >
            {task.description}
          </Text>

          {/* Images */}
          {task.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {task.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.taskImage}
                />
              ))}
            </ScrollView>
          )}

          {/* Location */}
          <View style={styles.locationContainer}>
            <MapPin color={colors.textSecondary} size={16} />
            <Text
              style={[styles.locationText, { color: colors.textSecondary }]}
            >
              {task.location.address}
            </Text>
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Clock color={colors.textTertiary} size={14} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <User color={colors.textTertiary} size={14} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                Task #{task.id.toUpperCase()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Contact Information */}
        <Card style={styles.contactCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contact Information
          </Text>

          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.text }]}>
                John Citizen
              </Text>
              <Text
                style={[styles.contactRole, { color: colors.textSecondary }]}
              >
                Issue Reporter
              </Text>
            </View>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleCallContact}
            >
              <Phone color={colors.primary} size={16} />
              <Text
                style={[styles.contactButtonText, { color: colors.primary }]}
              >
                Call
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleNavigate}
            >
              <Navigation color={colors.primary} size={20} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Navigate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleAddPhoto}
            >
              <Camera color={colors.success} size={20} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Add Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleAddNote}
            >
              <MessageSquare color={colors.warning} size={20} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Add Note
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Task Actions */}
        {isNewTask ? (
          <View style={styles.taskActions}>
            <TouchableOpacity
              style={[styles.acceptButton, { backgroundColor: colors.success }]}
              onPress={handleAcceptTask}
              disabled={actionLoading}
            >
              <CheckCircle color={colors.text} size={20} />
              <Text style={[styles.acceptButtonText, { color: colors.text }]}>
                Accept Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleRejectTask}
              disabled={actionLoading}
            >
              <XCircle color={colors.error} size={20} />
              <Text style={[styles.rejectButtonText, { color: colors.error }]}>
                Reject Task
              </Text>
            </TouchableOpacity>
          </View>
        ) : task.status === 'accepted' ? (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: colors.primary }]}
            onPress={handleCompleteTask}
            disabled={actionLoading}
          >
            <CheckCircle color={colors.text} size={20} />
            <Text style={[styles.completeButtonText, { color: colors.text }]}>
              Mark as Completed
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      {actionLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButtonHeader: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 11,
    color: '#F9FAFB',
    fontWeight: '700',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 12,
    lineHeight: 28,
  },
  taskDescription: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 16,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  taskImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  contactCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  contactRole: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF620',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#F9FAFB',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
  },
  rejectButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#F9FAFB',
    marginTop: 12,
  },
});
