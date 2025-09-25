import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ShieldAlert } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredPermissions?: string[];
  requireAnyPermission?: string[];
  requireAllPermissions?: string[];
  fallbackRoute?: string;
  showUnauthorized?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requiredPermissions = [],
  requireAnyPermission = [],
  requireAllPermissions = [],
  fallbackRoute = '/landing',
  showUnauthorized = true,
}) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!isLoading) {
      // Check authentication requirement
      if (requireAuth && !isAuthenticated) {
        router.replace('/landing' as any);
        return;
      }

      // Check specific permissions
      if (
        requiredPermissions.length > 0 &&
        !hasPermission(requiredPermissions[0])
      ) {
        if (showUnauthorized) {
          // Show unauthorized screen
          return;
        } else {
          router.replace('/landing' as any);
          return;
        }
      }

      // Check any permission requirement
      if (
        requireAnyPermission.length > 0 &&
        !hasAnyPermission(requireAnyPermission)
      ) {
        if (showUnauthorized) {
          return;
        } else {
          router.replace('/landing' as any);
          return;
        }
      }

      // Check all permissions requirement
      if (
        requireAllPermissions.length > 0 &&
        !hasAllPermissions(requireAllPermissions)
      ) {
        if (showUnauthorized) {
          return;
        } else {
          router.replace('/landing' as any);
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <ShieldAlert color={colors.primary} size={48} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Verifying Access...
          </Text>
          <Text
            style={[styles.loadingSubtext, { color: colors.textSecondary }]}
          >
            Please wait while we check your permissions
          </Text>
        </View>
      </LinearGradient>
    );
  }

  // Check if user is unauthorized
  const isUnauthorized =
    (requireAuth && !isAuthenticated) ||
    (requiredPermissions.length > 0 &&
      !hasPermission(requiredPermissions[0])) ||
    (requireAnyPermission.length > 0 &&
      !hasAnyPermission(requireAnyPermission)) ||
    (requireAllPermissions.length > 0 &&
      !hasAllPermissions(requireAllPermissions));

  if (isUnauthorized && showUnauthorized) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.unauthorizedContainer}
      >
        <View style={styles.unauthorizedContent}>
          <ShieldAlert color={colors.error} size={64} />
          <Text style={[styles.unauthorizedTitle, { color: colors.text }]}>
            Access Denied
          </Text>
          <Text
            style={[styles.unauthorizedText, { color: colors.textSecondary }]}
          >
            You don&apos;t have permission to access this section.
          </Text>
          <Text
            style={[styles.unauthorizedSubtext, { color: colors.textTertiary }]}
          >
            Required role:{' '}
            {requiredPermissions.join(', ') ||
              requireAnyPermission.join(' or ') ||
              'Authenticated User'}
          </Text>

          <View style={styles.unauthorizedActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.replace('/(tabs)/profile')}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Go to Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { borderColor: colors.border, borderWidth: 1 },
              ]}
              onPress={() => router.replace('/role-select')}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: colors.textSecondary },
                ]}
              >
                Change Role
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // User is authorized, render children
  return <>{children}</>;
};

// Higher-order component for protecting entire screens
export const withAuth = (
  Component: React.ComponentType<any>,
  options: Omit<AuthGuardProps, 'children'> = {}
) => {
  const WrappedComponent = (props: any) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
  WrappedComponent.displayName = `withAuth(${
    Component.displayName || Component.name || 'Component'
  })`;
  return WrappedComponent;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthorizedContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  unauthorizedText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  unauthorizedSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.8,
  },
  unauthorizedActions: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
