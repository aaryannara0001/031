import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Home, ShieldAlert, User } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UnauthorizedScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const getSuggestedActions = () => {
    if (!user) {
      return [
        {
          title: 'Sign In',
          description: 'Log in to access this feature',
          icon: User,
          action: () => router.replace('/landing'),
          color: colors.primary,
        },
        {
          title: 'Choose Role',
          description: 'Select your access level',
          icon: ShieldAlert,
          action: () => router.replace('/role-select'),
          color: colors.warning,
        },
      ];
    }

    // User is logged in but doesn't have permission
    const roleSuggestions = {
      citizen: [
        {
          title: 'Go Home',
          description: 'Access citizen features',
          icon: Home,
          action: () => router.replace('/welcome'),
          color: colors.primary,
        },
        {
          title: 'Change Role',
          description: 'Switch to a different role',
          icon: ShieldAlert,
          action: () => router.replace('/role-select'),
          color: colors.warning,
        },
      ],
      fieldworker: [
        {
          title: 'Field Dashboard',
          description: 'Access your field tasks',
          icon: Home,
          action: () => router.replace('/fieldworker'),
          color: colors.success,
        },
        {
          title: 'My Tasks',
          description: 'View assigned work',
          icon: User,
          action: () => router.replace('/tasks'),
          color: colors.primary,
        },
      ],
      staff: [
        {
          title: 'Staff Dashboard',
          description: 'Access departmental tools',
          icon: Home,
          action: () => router.replace('/welcome'),
          color: colors.warning,
        },
        {
          title: 'Reports',
          description: 'Manage issue reports',
          icon: User,
          action: () => router.replace('/reports'),
          color: colors.primary,
        },
      ],
      admin: [
        {
          title: 'Admin Dashboard',
          description: 'Full system access',
          icon: Home,
          action: () => router.replace('/admin-dashboard'),
          color: colors.error,
        },
        {
          title: 'System Settings',
          description: 'Manage system configuration',
          icon: ShieldAlert,
          action: () => router.replace('/admin-dashboard'),
          color: colors.primary,
        },
      ],
    };

    return roleSuggestions[user.role] || roleSuggestions.citizen;
  };

  const suggestedActions = getSuggestedActions();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/landing')}
          >
            <ArrowLeft color={colors.textSecondary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Error Content */}
        <View style={styles.errorContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.error + '20' },
            ]}
          >
            <ShieldAlert color={colors.error} size={64} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            Access Restricted
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You don&apos;t have permission to access this area
          </Text>

          {user && (
            <View
              style={[
                styles.userInfo,
                { backgroundColor: colors.surface + '80' },
              ]}
            >
              <Text style={[styles.userRole, { color: colors.primary }]}>
                Current Role:{' '}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Text>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user.name}
              </Text>
            </View>
          )}

          <Text style={[styles.description, { color: colors.textTertiary }]}>
            This section requires specific permissions that your current account
            doesn&apos;t have. Please contact your administrator or try
            accessing a different section.
          </Text>
        </View>

        {/* Suggested Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.actionsTitle, { color: colors.text }]}>
            What you can do:
          </Text>

          {suggestedActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { borderColor: colors.border }]}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: action.color + '20' },
                  ]}
                >
                  <IconComponent color={action.color} size={24} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>
                    {action.title}
                  </Text>
                  <Text
                    style={[
                      styles.actionDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {action.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contact Support */}
        <View
          style={[
            styles.supportSection,
            { backgroundColor: colors.surface + '50' },
          ]}
        >
          <Text style={[styles.supportTitle, { color: colors.text }]}>
            Need Help?
          </Text>
          <Text style={[styles.supportText, { color: colors.textSecondary }]}>
            If you believe this is an error or need access to this section,
            please contact your system administrator or support team.
          </Text>
          <TouchableOpacity
            style={[styles.supportButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/help')}
          >
            <Text style={[styles.supportButtonText, { color: colors.text }]}>
              Contact Support
            </Text>
          </TouchableOpacity>
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
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  errorContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  userInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  supportSection: {
    padding: 20,
    borderRadius: 16,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
