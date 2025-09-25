import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Lock,
  Shield,
  Trash2,
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PrivacyScreen() {
  const { user } = useAuth();
  const [settings, setSettings] = React.useState({
    profileVisibility: true,
    locationSharing: false,
    dataCollection: true,
    analytics: false,
    twoFactorAuth: false,
    biometricAuth: true,
  });

  const privacyOptions = [
    {
      key: 'profileVisibility',
      icon: Eye,
      title: 'Profile Visibility',
      description: 'Make your profile visible to other community members',
      enabled: settings.profileVisibility,
    },
    {
      key: 'locationSharing',
      icon: EyeOff,
      title: 'Location Sharing',
      description: 'Share your location when reporting issues',
      enabled: settings.locationSharing,
    },
    {
      key: 'dataCollection',
      icon: Shield,
      title: 'Data Collection',
      description: 'Allow collection of usage data to improve the app',
      enabled: settings.dataCollection,
    },
    {
      key: 'analytics',
      icon: CheckCircle,
      title: 'Analytics',
      description: 'Help improve the app with anonymous usage statistics',
      enabled: settings.analytics,
    },
  ];

  const securityOptions = [
    {
      key: 'twoFactorAuth',
      icon: Key,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: settings.twoFactorAuth,
    },
    {
      key: 'biometricAuth',
      icon: Lock,
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face ID to unlock the app',
      enabled: settings.biometricAuth,
    },
  ];

  const updateSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert(
              'Account Deleted',
              'Your account has been successfully deleted.'
            );
            router.replace('/landing');
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change functionality would be implemented here.'
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Data',
      "Your data export has been requested. You will receive an email when it's ready."
    );
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
            onPress={() => router.replace('/profile')}
          >
            <ArrowLeft color="#F9FAFB" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Privacy Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>

          {privacyOptions.map((item, index) => (
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

        {/* Security Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Security Settings</Text>

          {securityOptions.map((item, index) => (
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

        {/* Account Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Account Management</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangePassword}
          >
            <Key color="#8B5CF6" size={20} />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Change Password</Text>
              <Text style={styles.actionDescription}>
                Update your account password
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownloadData}
          >
            <Shield color="#8B5CF6" size={20} />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Download Your Data</Text>
              <Text style={styles.actionDescription}>
                Get a copy of all your data
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Data Privacy Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Shield color="#10B981" size={20} />
            <Text style={styles.infoTitle}>Your Privacy Matters</Text>
          </View>
          <Text style={styles.infoText}>
            We are committed to protecting your privacy. Your personal
            information is encrypted and securely stored. We never share your
            data with third parties without your consent.
          </Text>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <AlertTriangle color="#EF4444" size={20} />
            <Text style={styles.dangerTitle}>Danger Zone</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Trash2 color="#EF4444" size={20} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>

          <Text style={styles.dangerText}>
            Once you delete your account, there is no going back. Please be
            certain.
          </Text>
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
  actionsCard: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  actionText: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#10B98120',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#D1FAE5',
    lineHeight: 20,
  },
  dangerCard: {
    marginBottom: 24,
    backgroundColor: '#EF444420',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dangerTitle: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dangerText: {
    fontSize: 14,
    color: '#FECACA',
    lineHeight: 20,
  },
});
