import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { mockIssues } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  CheckSquare,
  MapPin,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  // Debug logging for screen content
  console.log('HomeScreen - User role:', user?.role);
  console.log('HomeScreen - Rendering for role:', user?.role);

  // Redirect admin/staff users to their specific dashboard content
  if (user?.role === 'admin' || user?.role === 'staff') {
    return <AdminStaffDashboard />;
  }

  // Redirect fieldworker users to their specific dashboard
  if (user?.role === 'fieldworker') {
    return <FieldworkerDashboard />;
  }

  // Default citizen dashboard
  return <CitizenDashboard />;
}

// Admin/Staff Dashboard Component
function AdminStaffDashboard() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const stats = [
    {
      title: 'Total Reports',
      value: '1,247',
      change: '+12%',
      color: '#EF4444',
    },
    {
      title: 'Resolved',
      value: '892',
      change: '+8%',
      color: '#10B981',
    },
    {
      title: 'Pending',
      value: '156',
      change: '-3%',
      color: '#F59E0B',
    },
    {
      title: 'Active Staff',
      value: '24',
      change: '+2',
      color: '#8B5CF6',
    },
  ];

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
                }}
                style={styles.avatar}
              />
              <View>
                <Text
                  style={[styles.greeting, { color: colors.textSecondary }]}
                >
                  Welcome back,
                </Text>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.name || 'Administrator'}
                </Text>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <Text style={[styles.roleText, { color: colors.primary }]}>
                    {user?.role?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell color="#9CA3AF" size={24} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text
                  style={[styles.statTitle, { color: colors.textSecondary }]}
                >
                  {stat.title}
                </Text>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: stat.color + '20' },
                  ]}
                >
                  <TrendingUp color={stat.color} size={16} />
                </View>
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statChange, { color: stat.color }]}>
                {stat.change} from last month
              </Text>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/user-management')}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <Users color={colors.primary} size={24} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Manage Users
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/analytics')}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.success + '20' },
                ]}
              >
                <BarChart3 color={colors.success} size={24} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                View Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/reports')}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.warning + '20' },
                ]}
              >
                <AlertTriangle color={colors.warning} size={24} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Manage Reports
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

// Fieldworker Dashboard Component
function FieldworkerDashboard() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const taskStats = {
    assigned: 8,
    completed: 12,
    pending: 3,
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
                }}
                style={styles.avatar}
              />
              <View>
                <Text
                  style={[styles.greeting, { color: colors.textSecondary }]}
                >
                  Good morning,
                </Text>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.name || 'Field Worker'}
                </Text>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <Text style={[styles.roleText, { color: colors.primary }]}>
                    FIELDWORKER
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell color="#9CA3AF" size={24} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Task Stats */}
        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Tasks
          </Text>
          <View style={styles.statsRowGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {taskStats.assigned}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Assigned
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {taskStats.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {taskStats.pending}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Pending
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/tasks')}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <CheckSquare color={colors.primary} size={24} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                View Tasks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/map')}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.success + '20' },
                ]}
              >
                <MapPin color={colors.success} size={24} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Field Map
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

// Citizen Dashboard Component (Original)
function CitizenDashboard() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const recentIssues = mockIssues.slice(0, 3);
  const stats = {
    reported: 12,
    resolved: 8,
    community: 156,
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
                }}
                style={styles.avatar}
              />
              <View>
                <Text
                  style={[styles.greeting, { color: colors.textSecondary }]}
                >
                  Good morning,
                </Text>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.name || 'Guest'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell color="#9CA3AF" size={24} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Points Badge */}
          {user?.role === 'citizen' && (
            <View
              style={[
                styles.pointsBadge,
                {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                },
              ]}
            >
              <Award color={colors.primary} size={20} />
              <Text style={[styles.pointsText, { color: colors.primary }]}>
                {user.points || 0} points
              </Text>
              <View
                style={[
                  styles.badgeContainer,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.badgeText}>
                  {user.badgeCount || 0} badges
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/report-issue')}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.actionIcon}
              >
                <Plus color="#FFFFFF" size={24} />
              </LinearGradient>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Report Issue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/map')}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: colors.surface }]}
              >
                <MapPin color={colors.primary} size={24} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                View Map
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/reports')}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: colors.surface }]}
              >
                <TrendingUp color={colors.success} size={24} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                My Reports
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Impact
          </Text>
          <View style={styles.statsRowGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.reported}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Reported
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.resolved}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Resolved
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.community}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Community
              </Text>
            </View>
          </View>
        </Card>

        {/* Recent Issues */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Nearby Issues
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {recentIssues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={[styles.issueItem, { borderBottomColor: colors.border }]}
            >
              <Image
                source={{ uri: issue.images[0] }}
                style={styles.issueImage}
              />
              <View style={styles.issueContent}>
                <View style={styles.issueHeader}>
                  <Text
                    style={[styles.issueTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {issue.title}
                  </Text>
                  <StatusBadge status={issue.status} size="sm" />
                </View>
                <Text
                  style={[
                    styles.issueLocation,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {issue.location.address}
                </Text>
                <View style={styles.issueFooter}>
                  <Text
                    style={[styles.issueDate, { color: colors.textTertiary }]}
                  >
                    {new Date(issue.reportedAt).toLocaleDateString()}
                  </Text>
                  <View style={styles.issueVotes}>
                    <Text
                      style={[styles.voteText, { color: colors.textSecondary }]}
                    >
                      👍 {issue.upvotes}
                    </Text>
                  </View>
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
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    color: '#6B7280',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  roleBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  pointsText: {
    color: '#8B5CF6',
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 12,
  },
  badgeContainer: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '500',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
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
  issueItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  issueImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  issueContent: {
    flex: 1,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  issueTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  issueLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  issueVotes: {
    flexDirection: 'row',
  },
  voteText: {
    fontSize: 11,
    color: '#6B7280',
  },
});
