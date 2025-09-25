import { Card } from '@/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Bell,
  CheckCircle,
  Info,
  MapPin,
  MessageSquare,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NotificationsScreen() {
  const [settings, setSettings] = React.useState({
    pushNotifications: true,
    issueUpdates: true,
    taskAssignments: true,
    communityPosts: false,
    achievementAlerts: true,
    locationAlerts: true,
    systemUpdates: false,
    emailNotifications: false,
  });

  const notificationTypes = [
    {
      key: 'pushNotifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      enabled: settings.pushNotifications,
    },
    {
      key: 'issueUpdates',
      icon: AlertTriangle,
      title: 'Issue Updates',
      description: 'Get notified when issues you reported are updated',
      enabled: settings.issueUpdates,
    },
    {
      key: 'taskAssignments',
      icon: CheckCircle,
      title: 'Task Assignments',
      description: 'Receive new task assignments and updates',
      enabled: settings.taskAssignments,
    },
    {
      key: 'communityPosts',
      icon: MessageSquare,
      title: 'Community Posts',
      description: 'Notifications about community discussions',
      enabled: settings.communityPosts,
    },
    {
      key: 'achievementAlerts',
      icon: Award,
      title: 'Achievement Alerts',
      description: 'Celebrate your milestones and badges',
      enabled: settings.achievementAlerts,
    },
    {
      key: 'locationAlerts',
      icon: MapPin,
      title: 'Location Alerts',
      description: 'Nearby issues and community events',
      enabled: settings.locationAlerts,
    },
    {
      key: 'systemUpdates',
      icon: Info,
      title: 'System Updates',
      description: 'App updates and maintenance notifications',
      enabled: settings.systemUpdates,
    },
  ];

  const updateSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#F9FAFB" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Notification Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          {notificationTypes.map((item, index) => (
            <View key={item.key} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <item.icon color="#8B5CF6" size={20} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={item.enabled}
                onValueChange={(value) => updateSetting(item.key, value)}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor={item.enabled ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          ))}
        </Card>

        {/* Email Notifications */}
        <Card style={styles.emailCard}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          <Text style={styles.emailDescription}>
            Receive important updates via email in addition to push
            notifications.
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell color="#8B5CF6" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>
                  Weekly summary and important alerts
                </Text>
              </View>
            </View>
            <Switch
              value={settings.emailNotifications}
              onValueChange={(value) =>
                updateSetting('emailNotifications', value)
              }
              trackColor={{ false: '#374151', true: '#8B5CF6' }}
              thumbColor={settings.emailNotifications ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </Card>

        {/* Notification History */}
        <Card style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <Award color="#10B981" size={16} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>
                New Achievement Unlocked!
              </Text>
              <Text style={styles.notificationMessage}>
                You&apos;ve earned the &quot;Community Hero&quot; badge
              </Text>
              <Text style={styles.notificationTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <CheckCircle color="#8B5CF6" size={16} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Task Completed</Text>
              <Text style={styles.notificationMessage}>
                Your assigned task has been marked as resolved
              </Text>
              <Text style={styles.notificationTime}>1 day ago</Text>
            </View>
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationIcon}>
              <AlertTriangle color="#F59E0B" size={16} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Issue Update</Text>
              <Text style={styles.notificationMessage}>
                Status changed for &quot;Pothole on Main St&quot;
              </Text>
              <Text style={styles.notificationTime}>2 days ago</Text>
            </View>
          </View>
        </Card>

        {/* Test Notification */}
        <TouchableOpacity style={styles.testButton}>
          <Bell color="#8B5CF6" size={20} />
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  settingsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emailCard: {
    marginBottom: 16,
  },
  emailDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  historyCard: {
    marginBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF620',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  testButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
