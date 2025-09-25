import { Card } from '@/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Home, Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      <View style={styles.content}>
        {/* 404 Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.errorCode}>404</Text>
          <Text style={styles.errorEmoji}>🔍</Text>
        </View>

        {/* Error Message */}
        <Card style={styles.messageCard}>
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Home color="#FFFFFF" size={20} />
            <Text style={styles.primaryButtonText}>Go Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#8B5CF6" size={20} />
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => router.push('/(tabs)/community')}
          >
            <Search color="#9CA3AF" size={20} />
            <Text style={styles.tertiaryButtonText}>Browse Issues</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            If you believe this is an error, please contact support.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 32,
  },
  errorCode: {
    fontSize: 72,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 16,
  },
  errorEmoji: {
    fontSize: 48,
  },
  messageCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 12,
  },
  tertiaryButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  helpContainer: {
    backgroundColor: '#8B5CF620',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  helpText: {
    color: '#8B5CF6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
