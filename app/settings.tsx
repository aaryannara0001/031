import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Database,
  Globe,
  Moon,
  Palette,
  RefreshCw,
  Smartphone,
  Sun,
  Volume2,
  VolumeX,
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

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [appSettings, setAppSettings] = React.useState({
    soundEnabled: true,
    hapticFeedback: true,
    autoRefresh: false,
    language: 'English',
    cacheSize: '245 MB',
  });

  const displayOptions = [
    {
      key: 'darkMode',
      icon: theme === 'dark' ? Moon : Sun,
      title: 'Dark Mode',
      description: 'Use dark theme for better battery life',
      enabled: theme === 'dark',
      type: 'switch',
    },
    {
      key: 'soundEnabled',
      icon: appSettings.soundEnabled ? Volume2 : VolumeX,
      title: 'Sound Effects',
      description: 'Play sounds for interactions and notifications',
      enabled: appSettings.soundEnabled,
      type: 'switch',
    },
    {
      key: 'hapticFeedback',
      icon: Smartphone,
      title: 'Haptic Feedback',
      description: 'Vibrate on button presses and interactions',
      enabled: appSettings.hapticFeedback,
      type: 'switch',
    },
  ];

  const dataOptions = [
    {
      key: 'autoRefresh',
      icon: RefreshCw,
      title: 'Auto Refresh',
      description: 'Automatically refresh data every 5 minutes',
      enabled: appSettings.autoRefresh,
      type: 'switch',
    },
  ];

  const updateSetting = (key: string, value: boolean) => {
    if (key === 'darkMode') {
      toggleTheme();
    } else {
      setAppSettings((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached data and images. The app may load slower temporarily.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Cache Cleared',
              'Cache has been successfully cleared.'
            );
            setAppSettings((prev) => ({ ...prev, cacheSize: '0 MB' }));
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all app settings to their default values.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setAppSettings({
              soundEnabled: true,
              hapticFeedback: true,
              autoRefresh: false,
              language: 'English',
              cacheSize: '245 MB',
            });
            Alert.alert(
              'Settings Reset',
              'All settings have been reset to default.'
            );
          },
        },
      ]
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
            onPress={() => router.back()}
          >
            <ArrowLeft color="#F9FAFB" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Display Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Display & Sound</Text>

          {displayOptions.map((item, index) => (
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

        {/* Data & Performance */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Data & Performance</Text>

          {dataOptions.map((item, index) => (
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

          <View style={styles.infoItem}>
            <View style={styles.settingLeft}>
              <Database color="#8B5CF6" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Cache Size</Text>
                <Text style={styles.settingDescription}>
                  Current cache usage
                </Text>
              </View>
            </View>
            <Text style={styles.infoValue}>{appSettings.cacheSize}</Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleClearCache}
          >
            <Database color="#F59E0B" size={20} />
            <Text style={styles.actionText}>Clear Cache</Text>
          </TouchableOpacity>
        </Card>

        {/* Language & Region */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Language & Region</Text>

          <View style={styles.pickerItem}>
            <View style={styles.settingLeft}>
              <Globe color="#8B5CF6" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDescription}>
                  Choose your preferred language
                </Text>
              </View>
            </View>
            <Text style={styles.pickerValue}>{appSettings.language}</Text>
          </View>

          <View style={styles.pickerItem}>
            <View style={styles.settingLeft}>
              <Palette color="#8B5CF6" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingDescription}>
                  App appearance theme
                </Text>
              </View>
            </View>
            <Text style={styles.pickerValue}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Text>
          </View>
        </Card>

        {/* App Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>App Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.01.15</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device</Text>
            <Text style={styles.infoValue}>iOS 17.0</Text>
          </View>
        </Card>

        {/* Reset Settings */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetSettings}
        >
          <RefreshCw color="#F59E0B" size={20} />
          <Text style={styles.resetText}>Reset All Settings</Text>
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoValue: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  actionText: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '500',
    marginLeft: 12,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  pickerValue: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B20',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  resetText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
