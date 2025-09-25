import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getPriorityColor, mockTasks } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react-native';
import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FieldWorkerScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const stats = {
    assigned: mockTasks.filter((t) => t.status === 'new').length,
    inProgress: mockTasks.filter((t) => t.status === 'accepted').length,
    completed: 15,
    pending: mockTasks.filter((t) => t.status === 'new').length,
  };

  const urgentTasks = mockTasks.filter(
    (t) => t.priority === 'high' || t.priority === 'critical'
  );

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                Field Portal
              </Text>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.name || 'Field Worker'}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: colors.success + '20',
                borderColor: colors.success,
              },
            ]}
          >
            <View
              style={[
                styles.onlineIndicator,
                { backgroundColor: colors.success },
              ]}
            />
            <Text style={[styles.statusText, { color: colors.success }]}>
              ON DUTY
            </Text>
          </View>
        </View>

        {/* Stats Dashboard */}
        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today&apos;s Overview
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <AlertTriangle color={colors.warning} size={20} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {stats.assigned}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Assigned
              </Text>
            </View>
            <View style={styles.statItem}>
              <Clock color={colors.primary} size={20} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {stats.inProgress}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                In Progress
              </Text>
            </View>
            <View style={styles.statItem}>
              <CheckCircle color={colors.success} size={20} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {stats.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
            </View>
          </View>
        </Card>

        {/* Urgent Tasks */}
        {urgentTasks.length > 0 && (
          <Card style={[styles.urgentCard, { borderLeftColor: colors.error }]}>
            <View style={styles.urgentHeader}>
              <AlertTriangle color={colors.error} size={20} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.error, marginBottom: 0, marginLeft: 8 },
                ]}
              >
                Urgent Tasks
              </Text>
            </View>
            {urgentTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.urgentTaskItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => router.push(`/task-detail/${task.id}`)}
              >
                <View style={styles.taskHeader}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]}
                  />
                  <Text style={[styles.taskTitle, { color: colors.text }]}>
                    {task.title}
                  </Text>
                </View>
                <Text
                  style={[styles.taskLocation, { color: colors.textSecondary }]}
                >
                  📍 {task.location.address}
                </Text>
                <View style={styles.taskFooter}>
                  <Text
                    style={[styles.taskTime, { color: colors.textTertiary }]}
                  >
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                  <StatusBadge status={task.status} size="sm" />
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* All Tasks */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              My Tasks
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {mockTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskItem, { borderBottomColor: colors.border }]}
              onPress={() => router.push(`/task-detail/${task.id}`)}
            >
              <Image
                source={{ uri: task.images[0] }}
                style={styles.taskImage}
              />
              <View style={styles.taskContent}>
                <View style={styles.taskItemHeader}>
                  <View style={styles.taskTitleRow}>
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(task.priority) },
                      ]}
                    />
                    <Text
                      style={[styles.taskItemTitle, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {task.title}
                    </Text>
                  </View>
                  <StatusBadge status={task.status} size="sm" />
                </View>

                <View style={styles.taskLocation}>
                  <MapPin color={colors.textSecondary} size={14} />
                  <Text
                    style={[
                      styles.taskLocationText,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {task.location.address}
                  </Text>
                </View>

                <View style={styles.taskMeta}>
                  <Text
                    style={[styles.taskCategory, { color: colors.primary }]}
                  >
                    {task.category}
                  </Text>
                  <Text
                    style={[styles.taskDue, { color: colors.textTertiary }]}
                  >
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  urgentCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  urgentTaskItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
  },
  taskLocation: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  taskImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  taskItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
  },
  taskLocationText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    flex: 1,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  taskCategory: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  taskDue: {
    fontSize: 11,
    color: '#6B7280',
  },
});
