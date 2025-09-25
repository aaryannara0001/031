import { useTheme } from '@/contexts/ThemeContext';
import { UserRole } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Briefcase,
  ChevronRight,
  Settings,
  Shield,
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

const roles = [
  {
    id: 'citizen' as UserRole,
    title: 'Community Citizen',
    subtitle: 'Community Member',
    description:
      'Active community member who can report local issues, track progress, vote on community priorities, and earn rewards for participation.',
    icon: Users,
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#A855F7'] as const,
    permissions: [
      'Report local issues and problems',
      'Vote and validate community reports',
      'Track progress on reported issues',
      'Earn points and unlock achievements',
      'Access community discussion forums',
    ],
    accessLevel: 'Public Access',
  },
  {
    id: 'fieldworker' as UserRole,
    title: 'Field Service Worker',
    subtitle: 'Service Provider',
    description:
      'Government field worker responsible for responding to reported issues, updating task status, and providing on-site resolution services.',
    icon: Briefcase,
    color: '#10B981',
    gradient: ['#10B981', '#34D399'] as const,
    permissions: [
      'Accept and manage assigned tasks',
      'Update task status and progress',
      'Access field service dashboard',
      'Report field updates and findings',
      'Coordinate with other field workers',
    ],
    accessLevel: 'Government Employee',
  },
  {
    id: 'staff' as UserRole,
    title: 'Department Staff',
    subtitle: 'Government Employee',
    description:
      'Department staff member responsible for managing issue assignments, monitoring departmental operations, and generating performance reports.',
    icon: Shield,
    color: '#F59E0B',
    gradient: ['#F59E0B', '#FBBF24'] as const,
    permissions: [
      'Assign tasks to field workers',
      'Monitor departmental performance',
      'Generate reports and analytics',
      'Manage team assignments',
      'Moderate community content',
    ],
    accessLevel: 'Department Staff',
  },
  {
    id: 'admin' as UserRole,
    title: 'System Administrator',
    subtitle: 'System Manager',
    description:
      'Full system administrator with complete access to user management, system configuration, advanced analytics, and policy control.',
    icon: Settings,
    color: '#EF4444',
    gradient: ['#EF4444', '#F87171'] as const,
    permissions: [
      'Complete user account management',
      'System configuration and settings',
      'Advanced analytics and reporting',
      'Policy and compliance management',
      'Full system administration rights',
    ],
    accessLevel: 'System Administrator',
  },
];

export default function RoleSelectScreen() {
  const { colors } = useTheme();

  const handleRoleSelect = (role: UserRole) => {
    router.push({
      pathname: '/signup',
      params: { role },
    });
  };

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
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Choose Your Role
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Select how you&apos;ll contribute to your community
            </Text>
          </View>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <TouchableOpacity
                key={role.id}
                style={styles.roleCard}
                onPress={() => handleRoleSelect(role.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={role.gradient}
                  style={styles.roleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.roleHeader}>
                    <View style={styles.roleIcon}>
                      <IconComponent color="#FFFFFF" size={28} />
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={styles.roleTitle}>{role.title}</Text>
                      <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                    </View>
                    <ChevronRight color="#FFFFFF" size={20} />
                  </View>

                  <Text style={styles.roleDescription}>{role.description}</Text>

                  <View style={styles.accessLevelContainer}>
                    <Text style={styles.accessLevelLabel}>Access Level:</Text>
                    <Text style={[styles.accessLevel, { color: role.color }]}>
                      {role.accessLevel}
                    </Text>
                  </View>

                  <Text style={styles.permissionsTitle}>Key Permissions:</Text>
                  <View style={styles.featuresContainer}>
                    {role.permissions.map((permission, featureIndex) => (
                      <View key={featureIndex} style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>{permission}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/login')}
          >
            <Text style={[styles.signInText, { color: colors.primary }]}>
              Already have an account? Sign In
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  rolesContainer: {
    flex: 1,
  },
  roleCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  roleGradient: {
    padding: 20,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  roleSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  roleDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  accessLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accessLevelLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginRight: 8,
  },
  accessLevel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  permissionsTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  signInButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
