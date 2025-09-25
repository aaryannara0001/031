import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  LogOut,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdminDashboardScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const stats = [
    {
      title: 'Total Reports',
      value: '1,247',
      change: '+12%',
      icon: AlertTriangle,
      color: '#EF4444',
    },
    {
      title: 'Resolved',
      value: '892',
      change: '+8%',
      icon: CheckCircle,
      color: '#10B981',
    },
    {
      title: 'Pending',
      value: '156',
      change: '-3%',
      icon: Clock,
      color: '#F59E0B',
    },
    {
      title: 'Active Users',
      value: '3,421',
      change: '+15%',
      icon: Users,
      color: '#8B5CF6',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      subtitle: 'Add, edit, or remove users',
      icon: Users,
      action: () => router.push('/user-management'),
      color: '#8B5CF6',
    },
    {
      title: 'System Settings',
      subtitle: 'Configure app settings',
      icon: Settings,
      action: () => router.push('/settings'),
      color: '#6B7280',
    },
    {
      title: 'Analytics',
      subtitle: 'View detailed reports',
      icon: BarChart3,
      action: () => router.push('/analytics'),
      color: '#10B981',
    },
    {
      title: 'Issue Management',
      subtitle: 'Oversee all reported issues',
      icon: Shield,
      action: () => router.push('/(tabs)/reports'),
      color: '#F59E0B',
    },
  ];

  const recentActivity = [
    {
      action: 'New user registered',
      user: 'john.doe@example.com',
      time: '2 minutes ago',
      type: 'user',
    },
    {
      action: 'Issue resolved',
      user: 'Field Worker #12',
      time: '15 minutes ago',
      type: 'issue',
    },
    {
      action: 'System backup completed',
      user: 'System',
      time: '1 hour ago',
      type: 'system',
    },
    {
      action: 'New report submitted',
      user: 'sarah.smith@example.com',
      time: '2 hours ago',
      type: 'report',
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
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Admin Dashboard
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              logout();
              router.replace('/landing');
            }}
          >
            <LogOut color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: stat.color + '20' },
                    ]}
                  >
                    <IconComponent color={stat.color} size={20} />
                  </View>
                  <View style={styles.statChange}>
                    <TrendingUp color="#10B981" size={12} />
                    <Text style={styles.statChangeText}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {stat.value}
                </Text>
                <Text
                  style={[styles.statTitle, { color: colors.textSecondary }]}
                >
                  {stat.title}
                </Text>
              </Card>
            );
          })}
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.actionItem,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={action.action}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color + '20' },
                    ]}
                  >
                    <IconComponent color={action.color} size={24} />
                  </View>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>
                    {action.title}
                  </Text>
                  <Text
                    style={[
                      styles.actionSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {action.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          {recentActivity.map((activity, index) => (
            <View
              key={index}
              style={[
                styles.activityItem,
                { borderBottomColor: colors.border },
              ]}
            >
              <View style={styles.activityContent}>
                <Text style={[styles.activityAction, { color: colors.text }]}>
                  {activity.action}
                </Text>
                <Text
                  style={[styles.activityUser, { color: colors.textSecondary }]}
                >
                  {activity.user}
                </Text>
              </View>
              <Text
                style={[styles.activityTime, { color: colors.textTertiary }]}
              >
                {activity.time}
              </Text>
            </View>
          ))}
        </Card>

        {/* System Status */}
        <Card style={styles.statusCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            System Status
          </Text>
          <View style={styles.statusItems}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusOnline]} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                API Services: Online
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusOnline]} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                Database: Online
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.statusWarning]} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                Storage: 78% Used
              </Text>
            </View>
          </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    marginRight: '4%',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    marginRight: '4%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  activityCard: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  activityUser: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusCard: {
    marginBottom: 24,
  },
  statusItems: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  statusOnline: {
    backgroundColor: '#10B981',
  },
  statusWarning: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 14,
    color: '#111827',
  },
});
