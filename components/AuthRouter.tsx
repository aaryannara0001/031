import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useSegments } from 'expo-router';
import { Shield } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AuthRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { colors } = useTheme();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Still checking authentication

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth screens, redirect to main app
      router.replace('/welcome');
    } else if (!isAuthenticated && inTabsGroup) {
      // User is not authenticated but trying to access protected screens
      router.replace('/landing');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.container}
      >
        <View style={styles.loadingContent}>
          <Shield color={colors.primary} size={48} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Authenticating...
          </Text>
          <Text
            style={[styles.loadingSubtext, { color: colors.textSecondary }]}
          >
            Please wait while we verify your session
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return null; // This component doesn't render anything, just handles routing
}

const styles = StyleSheet.create({
  container: {
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
});
