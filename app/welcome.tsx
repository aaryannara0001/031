import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MapPin, Sparkles } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getRoleMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Ready to manage the system?';
      case 'staff':
        return 'Ready to serve your department?';
      case 'fieldworker':
        return 'Ready to tackle field tasks?';
      case 'citizen':
      default:
        return 'Ready to improve your community?';
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <MapPin color={colors.text} size={40} />
          </View>
          <Text style={[styles.logo, { color: colors.text }]}>CivicHub</Text>
          <Sparkles color={colors.primary} size={24} style={styles.sparkle} />
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome back!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.primary }]}>
            {user?.name ? `Hello ${user.name.split(' ')[0]}!` : 'Hello!'}
          </Text>
          <Text
            style={[styles.welcomeMessage, { color: colors.textSecondary }]}
          >
            {getRoleMessage()}
          </Text>
          {user?.role && (
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
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Access
              </Text>
            </View>
          )}
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sparkle: {
    marginLeft: 8,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  roleBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 4,
    opacity: 0.7,
  },
  loadingDotDelay: {
    animationDelay: '0.2s',
  },
  loadingDotDelay2: {
    animationDelay: '0.4s',
  },
});
