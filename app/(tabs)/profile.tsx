import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Award,
  Bell,
  ChevronRight,
  CircleHelp as HelpCircle,
  LogOut,
  MapPin,
  Moon,
  Settings,
  Shield,
  Sun,
  TrendingUp,
  User,
} from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, colors, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const isAdmin = user?.role === 'admin';
  const isFieldWorker = user?.role === 'fieldworker';

  const citizenStats = {
    reports: 12,
    resolved: 8,
    points: 1250,
    badges: 3,
  };

  const fieldWorkerStats = {
    tasksCompleted: 45,
    averageTime: '2.3 days',
    rating: 4.8,
    totalPoints: 2840,
  };

  const menuItems = [
    {
      icon: User,
      label: 'Edit Profile',
      action: () => router.push('/edit-profile'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => router.push('/notifications'),
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      action: () => router.push('/privacy'),
    },
    {
      icon: Settings,
      label: 'App Settings',
      action: () => router.push('/settings'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => router.push('/help'),
    },
  ];

  // Add admin-specific menu items
  if (isAdmin) {
    menuItems.splice(3, 0, {
      icon: Shield,
      label: 'Admin Dashboard',
      action: () => router.push('/admin-dashboard'),
    });
  }

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
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200',
            }}
            style={styles.avatar}
          />
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor: colors.primary + '20',
                borderColor: colors.primary,
              },
            ]}
          >
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {user?.role?.toUpperCase() || 'CITIZEN'}
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {isFieldWorker ? 'Work Statistics' : 'Your Impact'}
          </Text>

          {isFieldWorker ? (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <TrendingUp color={colors.success} size={24} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {fieldWorkerStats.tasksCompleted}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Tasks Completed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Award color={colors.primary} size={24} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {fieldWorkerStats.rating}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Rating
                </Text>
              </View>
              <View style={styles.statItem}>
                <MapPin color={colors.warning} size={24} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {fieldWorkerStats.averageTime}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Avg. Time
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <TrendingUp color={colors.primary} size={24} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {citizenStats.reports}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Reports
                </Text>
              </View>
              <View style={styles.statItem}>
                <Award color={colors.success} size={24} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {citizenStats.resolved}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Resolved
                </Text>
              </View>
              <View style={styles.statItem}>
                <User color={colors.warning} size={24} />
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {citizenStats.points}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Points
                </Text>
              </View>
            </View>
          )}
        </Card>

        {/* Achievements/Badges (Citizen only) */}
        {!isFieldWorker && (
          <Card style={styles.badgesCard}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Achievements
              </Text>
              <TouchableOpacity onPress={() => router.push('/achievements')}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>🏆</Text>
                <Text style={[styles.badgeName, { color: colors.text }]}>
                  First Reporter
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>🎯</Text>
                <Text style={[styles.badgeName, { color: colors.text }]}>
                  Problem Solver
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>⭐</Text>
                <Text style={[styles.badgeName, { color: colors.text }]}>
                  Community Hero
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Settings
          </Text>

          <View
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingLeft}>
              {theme === 'dark' ? (
                <Sun color={colors.primary} size={20} />
              ) : (
                <Moon color={colors.primary} size={20} />
              )}
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Theme
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={
                theme === 'dark' ? colors.surface : colors.textSecondary
              }
            />
          </View>

          <View
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingLeft}>
              <Bell color={colors.primary} size={20} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={
                notificationsEnabled ? colors.surface : colors.textSecondary
              }
            />
          </View>

          <View
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
          >
            <View style={styles.settingLeft}>
              <MapPin color={colors.primary} size={20} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Location Services
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={
                locationEnabled ? colors.surface : colors.textSecondary
              }
            />
          </View>
        </Card>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={item.action}
            >
              <View style={styles.menuLeft}>
                <item.icon color={colors.textSecondary} size={20} />
                <Text style={[styles.menuLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </View>
              <ChevronRight color={colors.textTertiary} size={16} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + '20', borderColor: colors.error },
          ]}
          onPress={() => {
            logout();
            router.replace('/landing');
          }}
        >
          <LogOut color={colors.error} size={20} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: colors.textTertiary }]}>
            CivicHub v1.0.0
          </Text>
          <Text style={[styles.appBuild, { color: colors.textTertiary }]}>
            Built with ❤️ for our community
          </Text>
        </View>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#8B5CF620',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  badgesCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    alignItems: 'center',
    flex: 1,
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '500',
  },
  settingsCard: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF444420',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  appBuild: {
    fontSize: 11,
    color: '#6B7280',
  },
});
