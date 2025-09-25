import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ChevronRight,
  MapPin,
  Shield,
  Sparkles,
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

export default function LandingScreen() {
  const { colors } = useTheme();

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
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <MapPin color="#FFFFFF" size={32} />
            </View>
            <Text style={[styles.logo, { color: colors.text }]}>CivicHub</Text>
            <Sparkles color={colors.primary} size={20} style={styles.sparkle} />
          </View>

          <Text style={[styles.tagline, { color: colors.text }]}>
            Empowering Communities
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Transform your city through collaborative issue reporting and
            resolution
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.features}>
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.surface + '80',
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <MapPin color={colors.primary} size={24} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Report Issues
            </Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Capture and report local problems with photos and location
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.surface + '80',
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: colors.success + '20' },
              ]}
            >
              <Users color={colors.success} size={24} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Community Power
            </Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Validate reports and track resolution progress together
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.surface + '80',
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: colors.warning + '20' },
              ]}
            >
              <Shield color={colors.warning} size={24} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Real Impact
            </Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              See your reports turn into real-world solutions
            </Text>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              console.log('Get Started pressed');
              router.push('/role-select');
            }}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <ChevronRight color="#FFFFFF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              console.log('Already have account pressed');
              router.push('/login');
            }}
          >
            <Text
              style={[styles.secondaryButtonText, { color: colors.primary }]}
            >
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trust}>
          <Text style={[styles.trustText, { color: colors.textTertiary }]}>
            Trusted by 50,000+ citizens across 200+ cities
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
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sparkle: {
    marginLeft: 8,
  },
  tagline: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    marginBottom: 60,
  },
  featureCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  trust: {
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
